import { connectDB } from "@/lib/db";
import { getAdminSession } from "@/lib/getAdminSession";
import Lead from "@/models/Lead";

const SORT_OPTIONS = {
  newest: { createdAt: -1 },
  oldest: { createdAt: 1 },
  updated: { updatedAt: -1 },
};

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 50;

const ARCHIVE_OPTIONS = ["false", "true", "all"];

export async function GET(request) {
  try {
    // 1. Authenticate the admin.
    const session = await getAdminSession();

    if (!session) {
      return Response.json(
        {
          success: false,
          message: "Unauthorized.",
        },
        { status: 401 },
      );
    }

    const { searchParams } = new URL(request.url);

    // -----------------------------
    // Pagination parameters
    // -----------------------------

    const pageParam = searchParams.get("page");
    const limitParam = searchParams.get("limit");

    const page = pageParam
      ? Number.parseInt(pageParam, 10)
      : DEFAULT_PAGE;

    const limit = limitParam
      ? Number.parseInt(limitParam, 10)
      : DEFAULT_LIMIT;

    if (
      !Number.isInteger(page) ||
      page < 1 ||
      !Number.isInteger(limit) ||
      limit < 1 ||
      limit > MAX_LIMIT
    ) {
      return Response.json(
        {
          success: false,
          message: `Invalid pagination. Page must be at least 1 and limit must be between 1 and ${MAX_LIMIT}.`,
        },
        { status: 400 },
      );
    }

    // -----------------------------
    // Sorting parameter
    // -----------------------------

    const sortParam = searchParams.get("sort") || "newest";

    if (!Object.prototype.hasOwnProperty.call(SORT_OPTIONS, sortParam)) {
      return Response.json(
        {
          success: false,
          message:
            "Invalid sort option. Use newest, oldest, or updated.",
        },
        { status: 400 },
      );
    }

    const sort = SORT_OPTIONS[sortParam];

    // -----------------------------
    // Archive parameter
    // -----------------------------

    const archivedParam = searchParams.get("archived") || "false";

    if (!ARCHIVE_OPTIONS.includes(archivedParam)) {
      return Response.json(
        {
          success: false,
          message:
            "Invalid archive option. Use false, true, or all.",
        },
        { status: 400 },
      );
    }

    // -----------------------------
    // Database
    // -----------------------------

    await connectDB();

    const filter = {};

    /*
     * Active leads:
     *
     * New leads have isArchived: false.
     *
     * Older leads may not have the isArchived field because
     * they were created before the archive feature existed.
     *
     * Therefore, both cases must be treated as active.
     */
    if (archivedParam === "false") {
      filter.$or = [
        { isArchived: false },
        { isArchived: { $exists: false } },
      ];
    }

    // Archived leads only.
    if (archivedParam === "true") {
      filter.isArchived = true;
    }

    // "all" does not add an archive filter.

    const totalLeads = await Lead.countDocuments(filter);

    const totalPages = Math.ceil(totalLeads / limit);

    // Page 1 remains valid even when there are no leads.
    if (totalLeads > 0 && page > totalPages) {
      return Response.json(
        {
          success: false,
          message: "Requested page does not exist.",
        },
        { status: 400 },
      );
    }

    const skip = (page - 1) * limit;

    const leads = await Lead.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .select(
        "name email phone goal plan status message isArchived createdAt updatedAt",
      )
      .lean();

    return Response.json({
      success: true,
      count: leads.length,
      leads,
      pagination: {
        page,
        limit,
        totalLeads,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
      sort: sortParam,
      archived: archivedParam,
    });
  } catch (error) {
    console.error("Admin leads API error:", error);

    return Response.json(
      {
        success: false,
        message: "Unable to retrieve leads.",
      },
      { status: 500 },
    );
  }
}