module.exports = {


    friendlyName: 'Profile',


    description: 'Profile edit.',


    inputs: {
        first_name: {
            type: 'string',
            required: true
        },
        last_name: {
            type: 'string',
            required: true
        },
        image_url: {
            type: 'string',
           // required: false
        },
        user: {
            type: 'ref',
            required: true
        }
    },


    exits: {
        invalid: {
            responseType: 'badRequest',
            description: 'Driver not exists',
        },
        serverError: {
            description: 'send server error',
            responseType: 'serverError',
        },
    },


    fn: async function (inputs, exits) {
        sails.log.debug('calling user/edit/profile');
        try {
            let update = {
                first_name: inputs.first_name,
                last_name: inputs.last_name,
                image_url: inputs.image_url,
                is_form_submitted:1
                
            }
            // if (!_.isUndefined(inputs.status)) {
            //     update.status = inputs.status
            // }
            if(inputs.image_url == null){
                await User.update({ id: inputs.user.id }).set(update);
                inputs.user.first_name = inputs.first_name;
                inputs.user.last_name = inputs.last_name;
               
            }else{
                await User.update({ id: inputs.user.id }).set(update);
                inputs.user.first_name = inputs.first_name;
                inputs.user.last_name = inputs.last_name;
                inputs.user.image_url = inputs.image_url;
               
            }
            // inputs.user.status = inputs.status;
            const _user = await sails.helpers.jwt.generateToken.with({ user: inputs.user });
            return exits.success({ status: true, data: _user, message: 'Profile updated successfully' });
        } catch (e) {
            sails.log.error('error calling user/edit/profile', e);
            return exits.serverError({ status: false, data: [], message: 'Unable to update profile' })
        }
        // All done.

    }


};
