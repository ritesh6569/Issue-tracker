// import { Issue } from "../models/issueRaise.models.js";
// import { User } from "../models/user.models.js";
// import { sendEmail } from "../utils/emailService.js";
// import { Response } from "../models/response.models.js";
// import { asyncHandler } from "../utils/asyncHandler.js";
// import { ApiError } from "../utils/ApiError.js";
// import { ApiResponse } from "../utils/ApiResponse.js";

// // Helper function to get the current time in DD/MM/YYYY HH:MM:SS format
// const giveTime = () => {
//     const currentTime = new Date();
//     const day = String(currentTime.getDate()).padStart(2, '0');
//     const month = String(currentTime.getMonth() + 1).padStart(2, '0');
//     const year = currentTime.getFullYear();
//     const hours = String(currentTime.getHours()).padStart(2, '0');
//     const minutes = String(currentTime.getMinutes()).padStart(2, '0');
//     const seconds = String(currentTime.getSeconds()).padStart(2, '0');

//     return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
// };

// // Create a new issue
// const createIssue = asyncHandler(async (req, res) => {
//     const { issue, description, address, requireDepartment } = req.body;

//     if ([issue, address, requireDepartment].some((field) => field?.trim() === "")) {
//         throw new ApiError(400, "All fields are required");
//     }

//     const availableUser = await User.findOne({ department: requireDepartment });
//     if (!availableUser) {
//         throw new ApiError(401, "Required department is not available");
//     }

//     const newIssue = await Issue.create({
//         issue,
//         description,
//         address,
//         requireDepartment,
//         userId: req.user._id,
//         acknowledge_at: "",
//         createdAt: giveTime(),
//         updatedAt: giveTime(),
//     });

//     const subject = 'New Issue Assigned';
//     const text = `Dear ${availableUser.fullName},

// You have been assigned a new issue:

// Issue: ${issue}
// Description: ${description}
// Address: ${address}

// Please address this issue as soon as possible.

// Thank you,
// UAIMS HR`;

//     await sendEmail(availableUser.email, subject, text);

//     // const newResponse = await Response.create({ issueId: newIssue._id });
//     // await newIssue.save();
//     // await newResponse.save();
//     // await req.user.addProblem(newIssue._id);
//     // await req.user.addResponse(newResponse._id);

//     // res.status(200).json(new ApiResponse(200, { newIssue, newResponse }, "Issue is created successfully"));

//     res.status(200).json(new ApiResponse(200, { newIssue }, "Issue is created successfully"));
// });

// // Fetch issues for a department
// const getissue = asyncHandler(async (req, res) => {
//     const issues = await Issue.find({
//         require_department: req.user.department, // Use snake_case
//         complete: false,
//     });
//     res.status(200).json(new ApiResponse(201, issues, "Issues fetched successfully"));
// });

// // Fetch issues for a user
// const getIssueforuser = asyncHandler(async (req, res) => {
//     // Use snake_case for the database column names (user_id and complete)
//     const issues = await Issue.find({
//         user_id: req.user.id, // Use user_id in snake_case
//         complete: false
//     });

//     res.status(200).json(new ApiResponse(201, issues, "Issues fetched successfully for the user"));
// });


// // Update responses for a department
// const updateResponses = asyncHandler(async (req, res) => {
//     const { description, requirements, actionTaken, complete } = req.body;
//     const issues = await Issue.find({ requireDepartment: req.user.department });

//     if (issues.length === 0) throw new ApiError(404, "No issues found for the department");

//     const updatedResponses = await Promise.all(
//         issues.map(async (issue) => {
//             const response = await Response.findOne({ issueId: issue._id });
//             if (response) {
//                 return await Response.findByIdAndUpdate(
//                     response._id,
//                     { description, requirements, actionTaken, complete },
//                     { new: true }
//                 );
//             }
//         })
//     );

//     const filteredResponses = updatedResponses.filter(Boolean);
//     if (filteredResponses.length === 0) throw new ApiError(404, "No responses found to update");

//     res.status(200).json(new ApiResponse(200, filteredResponses, "Responses updated successfully"));
// });

// // Complete a specific report
// const completeReport = asyncHandler(async (req, res) => {
//     const { issueId } = req.body;
//     const issue = await Issue.findOne({ _id: issueId, userId: req.user._id });

//     if (!issue) throw new ApiError(404, "No issue found with the provided ID for this user");

//     await Issue.updateOne({ _id: issueId }, { complete: true, updatedAt: giveTime() });
//     await Response.updateMany({ issueId }, { complete: true });

//     const responses = await Response.find({ issueId });
//     res.status(200).json(new ApiResponse(200, { issue, responses }, "Issue marked as complete successfully"));
// });

// // Acknowledge a response
// const acknowledgeResponse = asyncHandler(async (req, res) => {
//     const { responseId } = req.body;
//     const response = await Response.findOne({ issueId: responseId });

//     if (!response) throw new ApiError(404, "No response found with the provided ID");

//     const currentTime = giveTime();
//     await Issue.updateOne({ _id: responseId }, { acknowledge_at: currentTime });
//     await Response.updateOne({ issueId: responseId }, { acknowledge_at: currentTime });

//     res.status(200).json(new ApiResponse(200, response, "Response acknowledged successfully"));
// });

// // Fetch completed problems
// const fetchReport = asyncHandler(async (req, res) => {
//     const completedProblems = await Issue.find();
//     res.status(200).json(new ApiResponse(200, completedProblems, "Completed problems and responses fetched successfully"));
// });

// // Fetch admin's department
// const getAdmin = asyncHandler(async (req, res) => {
//     const department = req.user.department;
//     res.status(200).json(new ApiResponse(201, department, "Department fetched successfully for the user"));
// });

// export {
//     createIssue,
//     getissue,
//     getIssueforuser,
//     updateResponses,
//     completeReport,
//     acknowledgeResponse,
//     fetchReport,
//     getAdmin,
// };


import { getConnection } from "../db/index.js";  // Assuming you have a connection utility
import { sendEmail } from "../utils/emailService.js";
import { ApiResponse } from "../utils/ApiResponse.js";

// Helper function to get the current time in DD/MM/YYYY HH:MM:SS format
const giveTime = () => {
    const currentTime = new Date();
    const year = currentTime.getFullYear();
    const month = String(currentTime.getMonth() + 1).padStart(2, '0');
    const day = String(currentTime.getDate()).padStart(2, '0');
    const hours = String(currentTime.getHours()).padStart(2, '0');
    const minutes = String(currentTime.getMinutes()).padStart(2, '0');
    const seconds = String(currentTime.getSeconds()).padStart(2, '0');

    // Return the date in the format 'YYYY-MM-DD HH:MM:SS'
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};


// Create a new issue
const createIssue = async (req, res) => {
    const { issue, description, address, requireDepartment , userId} = req.body;

    if ([issue, address, requireDepartment].some((field) => field?.trim() === "")) {
        return res.status(400).json(new ApiResponse(400, null, "All fields are required"));
    }

    const connection = await getConnection();
    const [availableUser] = await connection.query("SELECT * FROM users WHERE department = ?", [requireDepartment]);

    if (!availableUser) {
        return res.status(401).json(new ApiResponse(401, null, "Required department is not available"));
    }

    const createdAt = giveTime();  // Returns correct date format
    const updatedAt = giveTime();  // Returns correct date format

    await connection.query("INSERT INTO issues (issue, description, address, require_department, user_id, created_at) VALUES (?, ?, ?, ?, ?, ?)",
        [issue, description, address, requireDepartment, userId, createdAt]);

    // Check if email exists
    if (availableUser.email) {
        // Send email to the department user
        const subject = 'New Issue Assigned';
        const text = `Dear ${availableUser.fullName},\n\nYou have been assigned a new issue:\n\nIssue: ${issue}\nDescription: ${description}\nAddress: ${address}\n\nPlease address this issue as soon as possible.\n\nThank you,\nUAIMS HR`;

        await sendEmail(availableUser.email, subject, text);
    } else {
        console.error("Email not available for user", availableUser);
    }

    res.status(200).json(new ApiResponse(200, { issue, description, address, requireDepartment }, "Issue created successfully"));
};



// Fetch issues for a department
const getissue = async (req, res) => {
    const connection = await getConnection();
    
    const [issues] = await connection.query("SELECT * FROM issues WHERE require_department = ? AND complete = false", [req.user.department]);

    res.status(200).json(new ApiResponse(200, issues, "Issues fetched successfully"));
};

// Fetch issues for a user
const getIssueforuser = async (req, res) => {
    const connection = await getConnection();
    console.log(req.user.id);
    const [issues] = await connection.query("SELECT * FROM issues WHERE user_id = ? AND complete = false", [req.user.id]);

    res.status(200).json(new ApiResponse(200, issues, "Issues fetched successfully for the user"));
};

// Update responses for a department
const updateResponses = async (req, res) => {
    const { description, requirements, actionTaken, complete } = req.body;
    const connection = await getConnection();

    const [issues] = await connection.query("SELECT * FROM issues WHERE requireDepartment = ?", [req.user.department]);

    if (issues.length === 0) {
        return res.status(404).json(new ApiResponse(404, null, "No issues found for the department"));
    }

    const updatedResponses = [];

    for (const issue of issues) {
        const [response] = await connection.query("SELECT * FROM responses WHERE issueId = ?", [issue._id]);
        if (response) {
            const [updatedResponse] = await connection.query(
                "UPDATE responses SET description = ?, requirements = ?, actionTaken = ?, complete = ? WHERE issueId = ?",
                [description, requirements, actionTaken, complete, issue._id]
            );
            updatedResponses.push(updatedResponse);
        }
    }

    if (updatedResponses.length === 0) {
        return res.status(404).json(new ApiResponse(404, null, "No responses found to update"));
    }

    res.status(200).json(new ApiResponse(200, updatedResponses, "Responses updated successfully"));
};

// Complete a specific report
const completeReport = async (req, res) => {
    const { issueId } = req.body;
    const connection = await getConnection();

    const [issue] = await connection.query("SELECT * FROM issues WHERE id = ?", [issueId]);

    if (!issue) {
        return res.status(404).json(new ApiResponse(404, null, "No issue found with the provided ID for this user"));
    }

    await connection.query("UPDATE issues SET complete = true, updated_at = ? WHERE id = ?", [giveTime(), issueId]);
    // await connection.query("UPDATE responses SET complete = true WHERE issueId = ?", [issueId]);

    // const [responses] = await connection.query("SELECT * FROM responses WHERE issueId = ?", [issueId]);
    res.status(200).json(new ApiResponse(200, { issue }, "Issue marked as complete successfully"));
};

// Acknowledge a response
const acknowledgeResponse = async (req, res) => {
    const { responseId } = req.body;
    const connection = await getConnection();

    // const [response] = await connection.query("SELECT * FROM responses WHERE id = ?", [responseId]);

    // if (!response) {
    //     return res.status(404).json(new ApiResponse(404, null, "No response found with the provided ID"));
    // }

    const currentTime = giveTime();
    console.log(responseId);
    
    await connection.query("UPDATE issues SET acknowledge_at = ? WHERE id = ?", [currentTime, responseId]);
    // await connection.query("UPDATE responses SET acknowledge_at = ? WHERE id = ?", [currentTime, responseId]);

    res.status(200).json(new ApiResponse(200, "Response acknowledged successfully"));
};

// Fetch completed problems
const fetchReport = async (req, res) => {
    const connection = await getConnection();
    
    const [problems] = await connection.query(`
        SELECT id,issue,description,address,require_department,complete,user_id,
            DATE_FORMAT(CONVERT_TZ(acknowledge_at, '+00:00','+00:00'), '%Y-%m-%d %H:%i:%s') AS acknowledge_at,
            DATE_FORMAT(CONVERT_TZ(created_at, '+00:00','+00:00'), '%Y-%m-%d %H:%i:%s') AS created_at,
    DATE_FORMAT(CONVERT_TZ(updated_at, '+00:00', '+00:00'), '%Y-%m-%d %H:%i:%s') AS updated_at
        FROM issues
    `);

    res.status(200).json(new ApiResponse(200, problems, "Completed problems and responses fetched successfully"));
};


// Fetch admin's department
const getAdmin = async (req, res) => {
    res.status(200).json(new ApiResponse(200, req.user.department, "Department fetched successfully for the user"));
};

export {
    createIssue,
    getissue,
    getIssueforuser,
    updateResponses,
    completeReport,
    acknowledgeResponse,
    fetchReport,
    getAdmin,
};
