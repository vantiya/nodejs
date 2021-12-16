const APIhelpers = require("./../utils/apiHelper");
const catchAsync = require("./../utils/catchAsync");

exports.deleteOne = (Modal) =>
    catchAsync(async (req, res, next) => {
        const doc = await Modal.findByIdAndDelete(req.params.id);
        if (!doc) {
            return next(
                new ApiError(
                    `No document found for the id: ${req.params.id} of ${Modal}`,
                    400
                )
            );
        }
        res.status(204).json({
            status: "success",
        });
    });

exports.updateOne = (Modal) =>
    catchAsync(async (req, res, next) => {
        const doc = await Modal.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!doc) {
            return next(
                new ApiError(
                    `No document found for the id: ${req.params.id} of ${Modal}`,
                    400
                )
            );
        }
        res.status(200).json({
            status: "success",
            data: doc,
        });
    });

exports.createOne = (Modal) =>
    catchAsync(async (req, res, next) => {
        const newDoc = await Modal.create(req.body);
        // console.log(newDoc);
        res.status(201).json({
            status: "success",
            data: newDoc,
        });
    });

exports.getOne = (Modal, popOpts) =>
    catchAsync(async (req, res, next) => {
        let query = Modal.findById(req.params.id);
        if (popOpts) query = query.populate(popOpts);
        const doc = await query;

        if (!doc) {
            return next(
                new ApiError(
                    `No document found for the id: ${req.params.id} of ${Modal}`,
                    400
                )
            );
        }
        res.status(200).json({
            status: "success",
            data: doc,
        });
    });

exports.getAll = (Modal) =>
    catchAsync(async (req, res, next) => {
        // for review part
        let filter = {};
        if (req.params.tourId) filter = { tour: req.params.tourId };

        const getQuery = new APIhelpers(Modal.find(filter), req.query)
            .filter()
            .sort()
            .getFields()
            .paginate();
        // const doc = await getQuery.query.explain();
        const doc = await getQuery.query;

        res.status(200).json({
            status: "success",
            total_data: doc.length,
            data: doc,
        });
    });
