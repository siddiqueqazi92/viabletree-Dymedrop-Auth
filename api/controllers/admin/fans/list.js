const {
  generateRandomString,
  generateEncryptedPassword,
} = require("../../../util");
var ejs = require("ejs");
const moment = require("moment");
const path = require("path");

module.exports = {
  friendlyName: "Create Fans",

  description: "Create Fans on Admin Panel.",

  inputs: {
    user: {
      type: "ref",
      required: true,
    },
    data: {
      type: "ref",
    },
    search: {
      type: "string",
    },
    filter :{
      type :"ref"
    },
    sort :{
      type :"ref"
    },
    obj :{
      type :"ref"
    }
  },

  exits: {
    badRequest: {
      description: "Bad  Request",
      responseType: "badRequest",
    },
  },

  fn: async function (inputs, exits) {
    try {
      sails.log(`Calling Admin/Fans/List 
                  Time: ${moment().format()}`);
                  sails.log({
                    inputs
                  })
      let getobj = JSON.parse(inputs.obj)
      // inputs.search = JSON.parse(inputs.search)
      // inputs.sort = JSON.parse(inputs.sort)
      // let where = `Where currentUser = 'fan' AND deletedAt = null`
      let obj = {
        where: {
          currentUser: "fan",
          deletedAt: null,
        },
      };

      let obj2 = `WHERE currentUser = 'fan' AND deletedAt = null `

      let filters = JSON.parse(getobj.filter)

      if(filters.search)
      {
        let searching;
        const textToSearch = filters.search.split(" ")
        // if(textToSearch.length > 1)
        // {
        //   searching = [
        //     {
        //       first_name : { contains : textToSearch[0] }
        //     },
        //     {
        //       last_name : { contains : textToSearch[1] }
        //     },
        //     {
        //       email : { contains : filters.search }
        //     }
        //   ]
        // }
        // else{
        //   searching = [
        //     {
        //       first_name : { contains : filters.search }
        //     },
  
        //     {
        //       email : { contains : filters.search }
        //     }
        //   ]
        // }
        obj.where.or = [
          {
            full_name : { contains : filters.search }
          },

          {
            email : { contains : filters.search }
          }
        ]
        obj2 += `AND first_name LIKE '%${filters.search}%' OR email LIKE '%${filters.search}%'`
      }
      
      if(filters)
      {   
        sails.log("filtersss===>" , filters)
        if(filters.is_active != "all" || filters.is_blocked != "all")
        {
          Object.keys(filters).forEach(key => {

            sails.log(key);
            if(filters[key] == "all")
            {

            }else if(key == "search"){
              
            }
            else if(key == "id")
            {
              obj.where.id = {
                in : filters[key]
              }

              obj2 += ` AND id in ('${filters[key].join('\',\'')}') `

            }
            else{
              obj.where[key] = filters[key]
              obj2 += ` AND ${key} = ${filters[key]}`
            }
            
          });
          // obj.where = getobj.filter
        }
      }
      console.log({obj2} , getobj.sort);
      if(!_.isUndefined(getobj.sort))
      {
        let sorting = JSON.parse(getobj.sort);
        if(sorting)
        {
            sails.log({sorting})
            obj.sort = `${sorting[0]} ${sorting[1]}`
            obj2 += ` ORDER BY ${sorting[0]} ${sorting[1]}`
        }
      }
      
      if (!_.isUndefined(getobj.range)) {
        getobj.range = JSON.parse(getobj.range)
        obj.skip = getobj.range[0];
        obj.limit = getobj.range[1] + 1;
        obj2 += ` LIMIT ${getobj.range[1] + 1} OFFSET ${getobj.range[0]} `
      }
      
      
      const countWhere = obj.where;
      const users = await User.find(obj);


      let totalPages = await User.count({ where: countWhere })

      return exits.success({
        status: true,
        data: users,
        message: "user listed successfully",
        total : `${users.length}/${totalPages}`
      });
      
    } catch (error) {
      return exits.badRequest({
        status: false,
        data: [],
        message: error.message,
      });
    }
  },
};
