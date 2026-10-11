import { connectDB } from "@/lib/db";
import Lead from "@/models/Lead";
import { leadRateLimit } from "@/lib/rateLimit";
import { getAdminSession } from "@/lib/getAdminSession";

/*
 * ============================================================
 * Shared constants
 * ============================================================
 */

const VALID_GOALS = [
  "weight-loss",
  "muscle-gain",
  "strength",
  "general-fitness",
  "other",
];

const VALID_PLANS = [
  "starter",
  "transformation",
  "premium",
  "not-sure",
];

const VALID_STATUSES = [
  "new",
  "contacted",
  "follow-up",
  "converted",
  "closed",
];

const SORT_OPTIONS = {
  newest: { createdAt: -1 },
  oldest: { createdAt: 1 },
  updated: { updatedAt: -1 },
};

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 50;
const MAX_SEARCH_LENGTH = 100;

/*
 * Escape special regex characters.
 *
 * This prevents user search text from being interpreted
 * as an arbitrary MongoDB regular expression.
 */
function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/*
 * ============================================================
 * POST — Public Lead Submission
 * ============================================================
 */

export async function POST(request) {
  try {
    // 1. Identify requester and apply rate limiting
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      "unknown";

    const { success, limit, remaining, reset } =
      await leadRateLimit.limit(ip);

    if (!success) {
      return Response.json(
        {
          success: false,
          message: "Too many requests. Please try again later.",
        },
        {
          status: 429,
          headers: {
            "X-RateLimit-Limit": limit.toString(),
            "X-RateLimit-Remaining": remaining.toString(),
            "X-RateLimit-Reset": reset.toString(),
          },
        },
      );
    }

    // 2. Read JSON data from the request
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

    if (
      body === null ||
      typeof body !== "object" ||
      Array.isArray(body)
    ) {
      return Response.json(
        {
          success: false,
          message: "Request body must be a JSON object.",
        },
        { status: 400 },
      );
    }

    // 3. Allow only expected fields
    const allowedFields = [
      "name",
      "email",
      "phone",
      "goal",
      "plan",
      "message",
      "website",
    ];

    const unknownFields = Object.keys(body).filter(
      (field) => !allowedFields.includes(field),
    );

    if (unknownFields.length > 0) {
      return Response.json(
        {
          success: false,
          message: "Unknown fields are not allowed.",
          fields: unknownFields,
        },
        { status: 400 },
      );
    }

    const {
      name,
      email,
      phone,
      goal,
      plan,
      message,
      website,
    } = body;

    // Reject requests that fill the hidden honeypot field
    if (
      typeof website === "string" &&
      website.trim() !== ""
    ) {
      return Response.json(
        {
          success: false,
          message: "Spam submission detected.",
        },
        { status: 400 },
      );
    }

    // 4. Server-side validation
    const errors = {};

    if (typeof name !== "string" || !name.trim()) {
      errors.name = "Name is required.";
    }

    if (typeof email !== "string" || !email.trim()) {
      errors.email = "Email is required.";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    ) {
      errors.email = "Please enter a valid email address.";
    }

    if (typeof phone !== "string" || !phone.trim()) {
      errors.phone = "Phone number is required.";
    }

    if (!goal) {
      errors.goal = "Fitness goal is required.";
    } else if (!VALID_GOALS.includes(goal)) {
      errors.goal = "Invalid fitness goal.";
    }

    if (!plan) {
      errors.plan = "Coaching plan is required.";
    } else if (!VALID_PLANS.includes(plan)) {
      errors.plan = "Invalid coaching plan.";
    }

    if (message && typeof message !== "string") {
      errors.message = "Message must be text.";
    }

    // 5. Stop request if validation failed
    if (Object.keys(errors).length > 0) {
      return Response.json(
        {
          success: false,
          message: "Invalid form data.",
          errors,
        },
        { status: 400 },
      );
    }

    // 6. Enforce server-side input length limits
    if (name.length > 100) {
      return Response.json(
        {
          success: false,
          message: "Name is too long.",
        },
        { status: 400 },
      );
    }

    if (email.length > 254) {
      return Response.json(
        {
          success: false,
          message: "Email is too long.",
        },
        { status: 400 },
      );
    }

    if (phone.length > 30) {
      return Response.json(
        {
          success: false,
          message: "Phone number is too long.",
        },
        { status: 400 },
      );
    }

    if (message && message.length > 1000) {
      return Response.json(
        {
          success: false,
          message: "Message is too long.",
        },
        { status: 400 },
      );
    }

    // 7. Connect to MongoDB
    await connectDB();

    // 8. Create and save the lead
    const lead = await Lead.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      goal,
      plan,
      message: message?.trim() || "",
      status: "new",
    });

    // 9. Return successful response
    return Response.json(
      {
        success: true,
        message: "Lead submitted successfully.",
        leadId: lead._id,
      },
      { status: 201 },
    );
  } catch (error) {
    // 10. Handle unexpected server errors
    console.error("Lead API error:", error);

    return Response.json(
      {
        success: false,
        message:
          "Something went wrong while processing the request.",
      },
      { status: 500 },
    );
  }
}

/*
 * ============================================================
 * GET — Protected Admin Leads
 *
 * Supports:
 * - Search
 * - Status filter
 * - Goal filter
 * - Plan filter
 * - Sorting
 * - Pagination
 *
 * Example:
 *
 * /api/admin/leads
 *   ?search=rahul
 *   &status=contacted
 *   &goal=muscle-gain
 *   &plan=premium
 *   &sort=updated
 *   &page=1
 *   &limit=10
 * ============================================================
 */

export async function GET(request) {
  try {
    // 1. Authenticate admin first
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

    // 2. Read query parameters
    const { searchParams } = new URL(request.url);

    const search = searchParams.get("search")?.trim() || "";

    const status = searchParams.get("status") || "all";
    const goal = searchParams.get("goal") || "all";
    const plan = searchParams.get("plan") || "all";

    const sortParam = searchParams.get("sort") || "newest";

    const pageParam = searchParams.get("page");
    const limitParam = searchParams.get("limit");

    const page = pageParam
      ? Number.parseInt(pageParam, 10)
      : DEFAULT_PAGE;

    const limit = limitParam
      ? Number.parseInt(limitParam, 10)
      : DEFAULT_LIMIT;

    // 3. Validate pagination
    if (
      !Number.isInteger(page) ||
      page < 1
    ) {
      return Response.json(
        {
          success: false,
          message: "Page must be a positive integer.",
        },
        { status: 400 },
      );
    }

    if (
      !Number.isInteger(limit) ||
      limit < 1 ||
      limit > MAX_LIMIT
    ) {
      return Response.json(
        {
          success: false,
          message: `Limit must be between 1 and ${MAX_LIMIT}.`,
        },
        { status: 400 },
      );
    }

    // 4. Validate search
    if (search.length > MAX_SEARCH_LENGTH) {
      return Response.json(
        {
          success: false,
          message: `Search cannot exceed ${MAX_SEARCH_LENGTH} characters.`,
        },
        { status: 400 },
      );
    }

    // 5. Validate sort option
    if (
      !Object.prototype.hasOwnProperty.call(
        SORT_OPTIONS,
        sortParam,
      )
    ) {
      return Response.json(
        {
          success: false,
          message:
            "Invalid sort option. Use newest, oldest, or updated.",
        },
        { status: 400 },
      );
    }

    // 6. Validate status filter
    if (
      status !== "all" &&
      !VALID_STATUSES.includes(status)
    ) {
      return Response.json(
        {
          success: false,
          message: "Invalid status filter.",
        },
        { status: 400 },
      );
    }

    // 7. Validate goal filter
    if (
      goal !== "all" &&
      !VALID_GOALS.includes(goal)
    ) {
      return Response.json(
        {
          success: false,
          message: "Invalid goal filter.",
        },
        { status: 400 },
      );
    }

    // 8. Validate plan filter
    if (
      plan !== "all" &&
      !VALID_PLANS.includes(plan)
    ) {
      return Response.json(
        {
          success: false,
          message: "Invalid plan filter.",
        },
        { status: 400 },
      );
    }

    // 9. Build MongoDB filter
    const filter = {};

    /*
     * Search name, email, or phone.
     *
     * Regex is escaped so the search value is treated
     * as normal text rather than a MongoDB regex pattern.
     */
    if (search) {
      const safeSearch = escapeRegex(search);

      filter.$or = [
        {
          name: {
            $regex: safeSearch,
            $options: "i",
          },
        },
        {
          email: {
            $regex: safeSearch,
            $options: "i",
          },
        },
        {
          phone: {
            $regex: safeSearch,
            $options: "i",
          },
        },
      ];
    }

    if (status !== "all") {
      filter.status = status;
    }

    if (goal !== "all") {
      filter.goal = goal;
    }

    if (plan !== "all") {
      filter.plan = plan;
    }

    // 10. Connect to MongoDB
    await connectDB();

    // 11. Count matching leads
    const totalLeads = await Lead.countDocuments(filter);

    const totalPages =
      totalLeads === 0
        ? 0
        : Math.ceil(totalLeads / limit);

    /*
     * If matching leads exist but requested page is
     * outside the available range, return 400.
     */
    if (
      totalLeads > 0 &&
      page > totalPages
    ) {
      return Response.json(
        {
          success: false,
          message: "Requested page does not exist.",
        },
        { status: 400 },
      );
    }

    // 12. Calculate how many documents to skip
    const skip = (page - 1) * limit;

    // 13. Fetch only the requested page
    const leads = await Lead.find(filter)
      .sort(SORT_OPTIONS[sortParam])
      .skip(skip)
      .limit(limit)
      .select(
        "name email phone goal plan status message createdAt updatedAt",
      )
      .lean();

    // 14. Return paginated response
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