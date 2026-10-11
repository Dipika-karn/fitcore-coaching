import { connectDB } from "@/lib/db";
import { getAdminSession } from "@/lib/getAdminSession";
import Lead from "@/models/Lead";

const ALLOWED_STATUSES = [
  "new",
  "contacted",
  "follow-up",
  "converted",
  "closed",
];

const OBJECT_ID_REGEX = /^[a-fA-F0-9]{24}$/;

export async function PATCH(request, { params }) {
  try {
    // 1. Authenticate the admin before processing the request.
    const session = await getAdminSession();

    if (!session) {
      return Response.json(
        { success: false, message: "Unauthorized." },
        { status: 401 },
      );
    }

    // 2. Read and validate the dynamic route ID.
    const { id } = await params;

    if (typeof id !== "string" || !OBJECT_ID_REGEX.test(id)) {
      return Response.json(
        { success: false, message: "Invalid lead ID." },
        { status: 400 },
      );
    }

    // 3. Parse the JSON request body.
    let body;

    try {
      body = await request.json();
    } catch {
      return Response.json(
        {
          success: false,
          message: "Invalid JSON request body.",
        },
        { status: 400 },
      );
    }

    // 4. Request body must be a plain object.
    if (
      body === null ||
      typeof body !== "object" ||
      Array.isArray(body) ||
      Object.getPrototypeOf(body) !== Object.prototype
    ) {
      return Response.json(
        {
          success: false,
          message: "Request body must be a JSON object.",
        },
        { status: 400 },
      );
    }

    // 5. Only one field can be changed per request.
    const keys = Object.keys(body);

    if (keys.length !== 1) {
      return Response.json(
        {
          success: false,
          message:
            "Only one lead field can be updated at a time.",
        },
        { status: 400 },
      );
    }

    const field = keys[0];

    // --------------------------------------------------
    // STATUS UPDATE
    // --------------------------------------------------

    if (field === "status") {
      // Validate the requested status.
      if (
        typeof body.status !== "string" ||
        !ALLOWED_STATUSES.includes(body.status)
      ) {
        return Response.json(
          {
            success: false,
            message:
              "Invalid status. Choose an approved lead status.",
          },
          { status: 400 },
        );
      }

      // Connect only after validation.
      await connectDB();

      const updatedLead = await Lead.findByIdAndUpdate(
        id,
        {
          $set: {
            status: body.status,
          },
        },
        {
          new: true,
          runValidators: true,
        },
      )
        .select("_id status isArchived updatedAt")
        .lean();

      if (!updatedLead) {
        return Response.json(
          {
            success: false,
            message: "Lead not found.",
          },
          { status: 404 },
        );
      }

      return Response.json({
        success: true,
        message: "Lead status updated successfully.",
        lead: {
          id: String(updatedLead._id),
          status: updatedLead.status,
          isArchived: updatedLead.isArchived,
          updatedAt: updatedLead.updatedAt,
        },
      });
    }

    // --------------------------------------------------
    // ARCHIVE / RESTORE
    // --------------------------------------------------

    if (field === "isArchived") {
      // isArchived must be a real boolean.
      if (typeof body.isArchived !== "boolean") {
        return Response.json(
          {
            success: false,
            message: "isArchived must be true or false.",
          },
          { status: 400 },
        );
      }

      // Connect only after validation.
      await connectDB();

      const updatedLead = await Lead.findByIdAndUpdate(
        id,
        {
          $set: {
            isArchived: body.isArchived,
          },
        },
        {
          new: true,
          runValidators: true,
        },
      )
        .select("_id status isArchived updatedAt")
        .lean();

      if (!updatedLead) {
        return Response.json(
          {
            success: false,
            message: "Lead not found.",
          },
          { status: 404 },
        );
      }

      return Response.json({
        success: true,
        message: body.isArchived
          ? "Lead archived successfully."
          : "Lead restored successfully.",
        lead: {
          id: String(updatedLead._id),
          status: updatedLead.status,
          isArchived: updatedLead.isArchived,
          updatedAt: updatedLead.updatedAt,
        },
      });
    }

    // --------------------------------------------------
    // UNKNOWN FIELD
    // --------------------------------------------------

    return Response.json(
      {
        success: false,
        message:
          "Only status or isArchived can be updated.",
      },
      { status: 400 },
    );
  } catch (error) {
    console.error("Update lead API error:", error);

    return Response.json(
      {
        success: false,
        message: "Unable to update lead.",
      },
      { status: 500 },
    );
  }
}