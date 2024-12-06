// import { asyncHandler } from "../utils/asyncHandler.js";
// import { ApiError } from "../utils/ApiError.js";
// import { User } from "../models/user.models.js";
// import { ApiResponse } from "../utils/ApiResponse.js";
// import jwt from "jsonwebtoken";
// import { Issue } from "../models/issueRaise.models.js";

// // Generate access and refresh tokens for a user
// const generateAccessAndRefreshTokens = async (userId) => {
//     try {
//         const user = await User.findById(userId);

//         const accessToken = user.generateAccessToken();
//         const refreshToken = user.generateRefreshToken();

//         user.refreshToken = refreshToken;
//         await user.save({ validateBeforeSave: false });

//         return { accessToken, refreshToken };
//     } catch (error) {
//         throw new ApiError(500, "Error generating access and refresh tokens");
//     }
// };

// // Register a new user
// const registerUser = asyncHandler(async (req, res) => {
//     const { fullName, email, username, password, department, phoneNumber } = req.body;

//     if ([fullName, email, username, password].some((field) => field?.trim() === "")) {
//         throw new ApiError(400, "All fields are required");
//     }

//     // const existingUser = await User.findOne({
//     //     $or: [{ username }, { email }],
//     // });

//     // if (existingUser) {
//     //     throw new ApiError(409, "User with email or username already exists");
//     // }

//     const user = await User.create({
//         fullName,
//         email,
//         password,
//         username: username.toLowerCase(),
//         department,
//         phoneNumber,
//     });

//     // const createdUser = await User.findById(user._id).select("-password -refreshToken");

//     // if (!createdUser) {
//     //     throw new ApiError(500, "Error registering user");
//     // }

//     return res.status(201).json( "User registered successfully");
// });

// // Login a user
// const loginUser = asyncHandler(async (req, res) => {
//     const { username, password } = req.body;

//     if (!username || !password) {
//         throw new ApiError(400, "Username and password are required");
//     }

//     // Use the correct method to find a user by username
//     const user = await User.findByUsername(username);

//     if (!user || !(await user.isPasswordCorrect(password))) {
//         throw new ApiError(401, "Invalid user credentials");
//     }

//     // Generate tokens using your class methods
//     const accessToken = user.generateAccessToken();
//     const refreshToken = user.generateRefreshToken();

//     // // You might want to store the refresh token in the database
//     // const connection = getConnection();
//     // await connection.query(`UPDATE users SET refresh_token = ? WHERE id = ?`, [refreshToken, user.id]);

//     const loggedInUser = {
//         id: user.id,
//         username: user.username,
//         email: user.email,
//         fullName: user.fullName,
//         phoneNumber: user.phoneNumber,
//         department: user.department,
//     };

//     const cookieOptions = {
//         httpOnly: true,
//         secure: true,
//         sameSite: "None",
//     };

//     res.cookie("accessToken", accessToken, cookieOptions);

//     return res.status(200).json(
//         new ApiResponse(200, { user: loggedInUser, accessToken, refreshToken }, "User logged in successfully")
//     );
// });


// // Logout a user
// const logoutUser = asyncHandler(async (req, res) => {
//     await User.findByIdAndUpdate(req.user._id, { $unset: { refreshToken: 1 } }, { new: true });

//     const cookieOptions = {
//         httpOnly: true,
//         secure: true,
//         sameSite: "None",
//     };

//     return res
//         .status(200)
//         .clearCookie("accessToken", cookieOptions)
//         .clearCookie("refreshToken", cookieOptions)
//         .json(new ApiResponse(200, {}, "User logged out successfully"));
// });

// // Refresh access token
// const refreshAccessToken = asyncHandler(async (req, res) => {
//     const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;

//     if (!incomingRefreshToken) {
//         throw new ApiError(401, "Unauthorized request");
//     }

//     try {
//         const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);
//         const user = await User.findById(decodedToken?._id);

//         if (!user || incomingRefreshToken !== user?.refreshToken) {
//             throw new ApiError(401, "Invalid or expired refresh token");
//         }

//         const { accessToken, refreshToken: newRefreshToken } = await generateAccessAndRefreshTokens(user._id);

//         const cookieOptions = {
//             httpOnly: true,
//             secure: true,
//             sameSite: "None",
//         };

//         return res
//             .status(200)
//             .cookie("accessToken", accessToken, cookieOptions)
//             .cookie("refreshToken", newRefreshToken, cookieOptions)
//             .json(
//                 new ApiResponse(200, { accessToken, refreshToken: newRefreshToken }, "Access token refreshed successfully")
//             );
//     } catch (error) {
//         throw new ApiError(401, error.message || "Invalid refresh token");
//     }
// });

// // Change user's current password
// const changeCurrentPassword = asyncHandler(async (req, res) => {
//     const { oldPassword, newPassword } = req.body;

//     const user = await User.findById(req.user?._id);

//     if (!(await user.isPasswordCorrect(oldPassword))) {
//         throw new ApiError(400, "Invalid old password");
//     }

//     user.password = newPassword;
//     await user.save({ validateBeforeSave: false });

//     return res.status(200).json(new ApiResponse(200, {}, "Password changed successfully"));
// });

// // Get current user's details
// const getCurrentUser = asyncHandler(async (req, res) => {
//     return res.status(200).json(new ApiResponse(200, req.user, "User fetched successfully"));
// });

// // Update account details
// const updateAccountDetails = asyncHandler(async (req, res) => {
//     const { fullName, email } = req.body;

//     if (!fullName || !email) {
//         throw new ApiError(400, "All fields are required");
//     }

//     const user = await User.findByIdAndUpdate(
//         req.user?._id,
//         { $set: { fullName, email } },
//         { new: true }
//     ).select("-password");

//     return res.status(200).json(new ApiResponse(200, user, "Account details updated successfully"));
// });

// // Get department-specific issues
// const getDepartmentIssues = asyncHandler(async (req, res) => {
//     const dep = req.user.department;
//     const fetchIssues = await Issue.find({ requireDepartment: dep });

//     return res.status(200).json(new ApiResponse(200, fetchIssues, "Issues fetched successfully"));
// });

// export {
//     registerUser,
//     loginUser,
//     logoutUser,
//     refreshAccessToken,
//     changeCurrentPassword,
//     getCurrentUser,
//     updateAccountDetails,
//     getDepartmentIssues,
// };



// import { asyncHandler } from "../utils/asyncHandler.js";
// import { ApiError } from "../utils/ApiError.js";
// import { User } from "../models/user.models.js";
// import { ApiResponse } from "../utils/ApiResponse.js";
// import jwt from "jsonwebtoken";

import bcrypt from "bcrypt";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";
import { getConnection } from "../db/index.js"; // Assuming you have a function to get a MySQL connection

// Generate access and refresh tokens for a user
const generateAccessAndRefreshTokens = async (userId) => {
    try {
        const connection = await getConnection();
        
        // Query for the user
        const [users] = await connection.query("SELECT * FROM users WHERE id = ?", [userId]);

        // Check if user exists
        if (users.length === 0) {
            throw new ApiError(404, "User not found");
        }

        const user = users[0];

        // Generate the access token with a short expiration time (15 minutes)
        const accessToken = jwt.sign({ id: user.id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "1d" });

        // Generate the refresh token with a longer expiration time (7 days)
        const refreshToken = jwt.sign({ id: user.id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "7d" });

        // Store the refresh token in the database
        await connection.query("UPDATE users SET refresh_token = ? WHERE id = ?", [refreshToken, user.id]);

        return { accessToken, refreshToken };
    } catch (error) {
        console.error("Error generating access and refresh tokens:", error.message); // Log the error
        throw new ApiError(500, "Error generating access and refresh tokens");
    }
};


// Register a new user
const registerUser = asyncHandler(async (req, res) => {
    const { fullName, email, username, password, department, phoneNumber } = req.body;

    if ([fullName, email, username, password].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "All fields are required");
    }

    const connection = await getConnection();

    // Fetch existing user
    const [existingUser] = await connection.query(
        "SELECT * FROM users WHERE username = ? OR email = ?",
        [username, email]
    );

    console.log("Query result:", existingUser);

    if (existingUser.length > 0) {
        throw new ApiError(409, "User with email or username already exists");
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    await connection.query(
        "INSERT INTO users (full_name, email, username, password, department, phone_number) VALUES (?, ?, ?, ?, ?, ?)",
        [fullName, email, username.toLowerCase(), hashedPassword, department, phoneNumber]
    );

    res.status(201).json("User registered successfully");
});


// Login a user
const loginUser = asyncHandler(async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        throw new ApiError(400, "Username and password are required");
    }

    const connection = await getConnection();

    // Fetch the user from the database
    const [rows] = await connection.query("SELECT * FROM users WHERE username = ?", [username]);

    // Check if the user exists
    if (rows.length === 0) {
        throw new ApiError(401, "Invalid user credentials");
    }

    // Extract the user object
    const user = rows[0];

    // Compare the provided password with the hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid user credentials");
    }

    // Generate tokens
    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user.id);

    // Prepare user response
    const loggedInUser = {
        id: user.id,
        username: user.username,
        email: user.email,
        fullName: user.full_name, // Make sure the field name matches your database column
        phoneNumber: user.phone_number, // Match column name
        department: user.department,
    };

    // Set cookies and send response
    res.cookie("accessToken", accessToken, { httpOnly: true, secure: true, sameSite: "None" });
    res.status(200).json(
        new ApiResponse(200, { user: loggedInUser, accessToken, refreshToken }, "User logged in successfully")
    );
});


// Logout a user
const logoutUser = asyncHandler(async (req, res) => {
    const connection = await getConnection();
    await connection.query("UPDATE users SET refresh_token = NULL WHERE id = ?", [req.user.id]);

    res.clearCookie("accessToken", { httpOnly: true, secure: true, sameSite: "None" });
    res.clearCookie("refreshToken", { httpOnly: true, secure: true, sameSite: "None" });
    res.status(200).json(new ApiResponse(200, {}, "User logged out successfully"));
});

// Refresh access token
const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;

    if (!incomingRefreshToken) throw new ApiError(401, "Unauthorized request");

    try {
        const decoded = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);
        const connection = await getConnection();
        const [user] = await connection.query("SELECT * FROM users WHERE id = ?", [decoded.id]);

        if (!user || user.refresh_token !== incomingRefreshToken) throw new ApiError(401, "Invalid or expired refresh token");

        const { accessToken, refreshToken: newRefreshToken } = await generateAccessAndRefreshTokens(user.id);

        res.cookie("accessToken", accessToken, { httpOnly: true, secure: true, sameSite: "None" });
        res.cookie("refreshToken", newRefreshToken, { httpOnly: true, secure: true, sameSite: "None" });
        res.status(200).json(new ApiResponse(200, { accessToken, refreshToken: newRefreshToken }, "Access token refreshed successfully"));
    } catch (error) {
        throw new ApiError(401, "Invalid refresh token");
    }
});

// Change user's current password
const changeCurrentPassword = asyncHandler(async (req, res) => {
    const { oldPassword, newPassword } = req.body;

    const connection = await getConnection();
    const [user] = await connection.query("SELECT * FROM users WHERE id = ?", [req.user.id]);

    if (user.password !== oldPassword) throw new ApiError(400, "Invalid old password");

    await connection.query("UPDATE users SET password = ? WHERE id = ?", [newPassword, req.user.id]);
    res.status(200).json(new ApiResponse(200, {}, "Password changed successfully"));
});

// Get current user's details
const getCurrentUser = asyncHandler(async (req, res) => {
    res.status(200).json(new ApiResponse(200, req.user, "User fetched successfully"));
});

// Update account details
const updateAccountDetails = asyncHandler(async (req, res) => {
    const { fullName, email } = req.body;

    if (!fullName || !email) throw new ApiError(400, "All fields are required");

    const connection = await getConnection();
    await connection.query("UPDATE users SET fullName = ?, email = ? WHERE id = ?", [fullName, email, req.user.id]);

    const [updatedUser] = await connection.query("SELECT * FROM users WHERE id = ?", [req.user.id]);
    res.status(200).json(new ApiResponse(200, updatedUser, "Account details updated successfully"));
});

// Get department-specific issues
const getDepartmentIssues = asyncHandler(async (req, res) => {
    const connection = await getConnection();
    const [issues] = await connection.query("SELECT * FROM issues WHERE require_department = ?", [req.user.department]);

    res.status(200).json(new ApiResponse(200, issues, "Issues fetched successfully"));
});

export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentUser,
    updateAccountDetails,
    getDepartmentIssues,
};
