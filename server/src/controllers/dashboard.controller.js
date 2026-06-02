// Dashboard Controller
// TODO: Implement getStats, weeklyTrend, byStatus, bySource, responseTime

import Application from "../models/Application.js";

export const getDashboardByStatus = async (req, res) => {
    try {

        const result = await Application.aggregate([
        // 1. Get only logged-in user's applications

            {
                $match: {
                    user: req.user._id
                }
            },
            // 2. Group by status

            {
                $group: {
                    _id: "$status",
                    count: { $sum: 1 }
                }
            }
        ])

        return res.status(200).json({
            success: true,
            data: result
        })
    }
    catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
}


export const getDashboardBySource = async (req, res) => {
    try {

        const result = await Application.aggregate([

            // 1. Get only logged-in user's applications
            {
                $match: {
                    user: req.user._id
                }
            },

            // 2. Group by source
            {
                $group: {
                    _id: "$source",
                    count: { $sum: 1 }
                }
            }

        ]);

        return res.status(200).json({
            success: true,
            data: result
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

export const getDashboardWeeklyTrend = async (req, res) => {
    try {

        const result = await Application.aggregate([

            // 1. Get only logged-in user's applications
            {
                $match: {
                    user: req.user._id
                }
            },

            // 2. Group applications by week
            {
                $group: {

                    // Create week label
                    _id: {
                        $dateToString: {
                            format: "%Y-%U",
                            date: "$createdAt"
                        }
                    },

                    // Count applications
                    count: {
                        $sum: 1
                    }

                }
            },

            // 3. Sort by week
            {
                $sort: {
                    _id: 1
                }
            },

            // 4. Limit to last 8 weeks
            {
                $limit: 8
            }

        ]);

        // 5. Send response
        return res.status(200).json({
            success: true,
            data: result
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

export const getDashboardStats = async (req, res) => {
    try {

        // 1. Total applications
        const totalApplications = await Application.countDocuments({
            user: req.user._id
        });

        // 2. Count applications by status
        const statusCounts = await Application.aggregate([
            {
                $match: {
                    user: req.user._id
                }
            },
            {
                $group: {
                    _id: "$status",
                    count: { $sum: 1 }
                }
            }
        ]);

        // 3. Get start of current week
        const startOfWeek = new Date();

        startOfWeek.setDate(
            startOfWeek.getDate() - startOfWeek.getDay()
        );

        startOfWeek.setHours(0, 0, 0, 0);

        // 4. Count applications created this week
        const thisWeekCount = await Application.countDocuments({
            user: req.user._id,
            createdAt: {
                $gte: startOfWeek
            }
        });

        // 5. Convert aggregation array into object
        const statusMap = {};

        statusCounts.forEach((item) => {
            statusMap[item._id] = item.count;
        });

        // 6. Calculate response rate
        const responses =
            (statusMap.phone_screen || 0) +
            (statusMap.interview || 0) +
            (statusMap.offer || 0);

        const responseRate =
            totalApplications > 0
                ? ((responses / totalApplications) * 100).toFixed(2)
                : 0;

        // 7. Final response
        res.status(200).json({
            success: true,

            data: {

                totalApplications,

                wishlist: statusMap.wishlist || 0,

                applied: statusMap.applied || 0,

                phone_screen: statusMap.phone_screen || 0,

                interview: statusMap.interview || 0,

                offer: statusMap.offer || 0,

                rejected: statusMap.rejected || 0,

                thisWeek: thisWeekCount,

                responseRate

            }
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};