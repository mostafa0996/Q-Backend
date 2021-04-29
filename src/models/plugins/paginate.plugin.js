const { admin, company, master } = require("../../config/contant");
const Category = require("../categories.model");


var RequiredAttribute = { image: 1, active: 1 }
var multilanguageValues = 'title_';

const paginate = (schema) => {

  schema.statics.paginate = async function (filter, options, req, Check) {


    const sort = {};
    if (options.sortBy) {
      const parts = options.sortBy.split(':');
      sort[parts[0]] = parts[1] === 'desc' ? -1 : 1;
    } else {

      if (Check.scheme === 'Cities') {
        if (req.headers['accept-language'] === 'en') {
          sort.title_en = 1;
          sort.title = 1;
        } else {

          if (((req.user.role === admin || req.user.role === master))) {
            sort.title_en = 1;
            sort.title = 1;
          } else {
            sort.title_ar = 1;
            sort.title = 1;
          }

        }
      } else {
        sort.createdAt = -1;
      }

    }
    console.log('sort', sort, Check.scheme, Check)


    options.page = Number(options.page) + 1;
    const limit = options.limit && parseInt(options.limit, 10) > 0 ? parseInt(options.limit, 10) : 10;
    const page = options.page && parseInt(options.page, 10) > 0 ? parseInt(options.page, 10) : 1;
    const skip = (page - 1) * limit;

    console.log(limit, page, skip)


    var agrigateFilters = [];

    var filters = {}
    if (filter.length > 0) {
      filters = {
        $and: filter,
      };
    }


    for (let k in filter) {
      agrigateFilters.push({ $match: filter[k] })
    }


    // check schema and add values required
    if (Check.scheme === 'Country') {
      RequiredAttribute = { image: 1, active: 1 }
      multilanguageValues = 'title_'
    }




    if (Check.scheme === 'Units') {
      RequiredAttribute = {}
      multilanguageValues = 'title_'
    }
    if (Check.scheme === 'Address') {
      agrigateFilters.push({
        '$lookup': {
          from: 'cities',
          let: { city: "$city" },
          as: 'cityObj',
          pipeline: [
            { $match: { $expr: { $eq: ["$_id", "$$city"] } } }, {
              $project: { title: '$' + multilanguageValues + req.headers['accept-language'] ? '$' + multilanguageValues + req.headers['accept-language'] : '$' + multilanguageValues + 'en', icon: 1, active: 1, }
            }
          ],
        }
      })
      agrigateFilters.push({ $unwind: '$cityObj' })
      agrigateFilters.push({ $sort: { createdAt: -1 } })
    }

    if (Check.scheme === 'Advantage') {
      RequiredAttribute = {
        active: 1, image: 1,
        'description': '$' + 'description_' + req.headers['accept-language'] ? '$' + 'description_' + req.headers['accept-language'] : 'description_' + 'en',
      }
    }


    if (Check.scheme === 'Notification') {
      RequiredAttribute = {
        read: 1, actionurl: 1, actionData: 1, createdAt: 1,
        'description': '$' + 'description_' + req.headers['accept-language'] ? '$' + 'description_' + req.headers['accept-language'] : 'description_' + 'en',
      }
    }


    if (Check.scheme === 'Subscriber') {
      RequiredAttribute = {
        active: 1, email: 1,
      }
    }


    if (Check.scheme === 'Type') {
      RequiredAttribute = {
        active: 1, image: 1, price: 1, duration: 1
      }
    }

    if ((!req.user || (req.user.role !== admin && req.user.role !== company && req.user.role !== master)) && (Check.scheme !== 'Address'))
      agrigateFilters.push({ '$project': { title: '$' + multilanguageValues + req.headers['accept-language'] ? '$' + multilanguageValues + req.headers['accept-language'] : 'en', ...RequiredAttribute } })


    if (options.isPagination) {
      const countPromise = await this.aggregate([...agrigateFilters, { $count: "count" }]);
      const docsPromise = this.aggregate(agrigateFilters).skip(skip).limit(limit).sort(sort)
      return Promise.all([countPromise[0] ? countPromise[0]['count'] : 0, docsPromise]).then((values) => {
        var [totalResults, results] = values;
        const totalPages = Math.ceil(totalResults / limit);
        const result = {
          results,
          page,
          limit,
          totalPages,
          totalResults,
        };
        return Promise.resolve(result);
      });
    } else {
      // const docsPromise = this.aggregate(agrigateFilters).sort(sort);
      const docsPromise = agrigateFilters.length !== 0 ? this.aggregate(agrigateFilters).sort(sort) : this.find(filters).sort(sort);
      return Promise.all([docsPromise]).then((values) => {
        var [results] = values;
        const result = {
          results,
        };
        return Promise.resolve(result);
      });
    }




  };
};

module.exports = paginate;
