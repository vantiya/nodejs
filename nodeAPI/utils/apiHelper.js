class APIhelpers {
    constructor(query, queryString) {
        this.query = query;
        this.queryString = queryString;
    }
    filter() {
        // Filter and retrieve filter fields from query string
        const filterObj = { ...this.queryString };
        const pageFields = ["page", "limit", "sort", "fields"];
        pageFields.forEach((el) => delete filterObj[el]);

        // Advance Filtering with operator
        const queryStr = JSON.stringify(filterObj).replace(
            /\b(gte|gt|lte|lt)\b/g,
            (match) => `$${match}`
        );

        this.query = this.query.find(JSON.parse(queryStr));
        return this;
    }
    sort() {
        // Sorting
        if (this.queryString.sort) {
            const sortBy = this.queryString.sort.split(",").join(" ");
            this.query = this.query.sort(sortBy);
        } else {
            this.query = this.query.sort("name -createdAt");
        }
        return this;
    }
    getFields() {
        // Limiting fields that required to fetch - projecting
        if (this.queryString.fields) {
            const fields = this.queryString.fields.split(",").join(" ");
            this.query = this.query.select(fields + " createdAt");
        } else {
            this.query = this.query.select("-__v");
        }
        return this;
    }
    paginate() {
        // Pagination
        const page = this.queryString.page * 1 || 1;
        const limit = this.queryString.limit * 1 || 100;
        const skip = (page - 1) * limit;
        this.query = this.query.skip(skip).limit(limit);
        // console.log(query);

        // if (this.queryString.page) {
        //     const numTours = await Tours.countDocuments();
        //     if (skip >= numTours) throw new Error("This page doesn't exists!");
        // }
        return this;
    }
}
module.exports = APIhelpers;
