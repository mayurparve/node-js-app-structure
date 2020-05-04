
const db = require('../models');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

// @desc Get all Tasks
// @route GET /api/v1/tasks
// @access public
exports.getTasks = asyncHandler(async (req, res, next) => {
    const tasks = await db.task.findAll();
    res.status(200).json({
        success: true,
        data: tasks
    })
});

// @desc Get single Task
// @route GET /api/v1/tasks/:id
// @access private
exports.getTask = asyncHandler(async (req, res, next) => {
    const task = await db.task.findByPk(req.params.id);

    if (!task)
        return next(new ErrorResponse(`Task not found`, 404));

    res.status(200).json({
        success: true,
        data: task
    })
});

// @desc Create new Task
// @route POST /api/v1/tasks/
// @access private
exports.createTask = asyncHandler(async (req, res, next) => {
    const task = await db.task.create(req.body);
    res.status(200).json({
        success: true,
        message: `new task added`,
        data: task
    })
});

// @desc Update Task
// @route PUT /api/v1/tasks/:id
// @access private
exports.updateTask = asyncHandler(async (req, res, next) => {
    const task = await db.task.update(req.body, {
        where: {
            task_id: req.params.id
        }
    });
    
    if (task == 0)
        return next(new ErrorResponse(`Task not found`, 404));

    res.status(200).json({
        success: true,
        data: task
    })
});

// @desc Delete Task
// @route DELETE /api/v1/tasks/:id
// @access private
exports.deleteTask = asyncHandler(async (req, res, next) => {
    const task = await db.task.destroy({
        where: {
            task_id: req.params.id
        }
    });

    if (task === 0)
        return next(new ErrorResponse(`Task not found`, 404));

    res.status(200).json({
        success: true,
        data: task
    })
});