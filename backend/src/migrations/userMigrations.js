const User = require('../api/user/user')

const addProfilePictureField = async () => {
	console.log('> addProfilePictureField')
	await User.find({ profilePicture: { $exists: false } }, (error, user) => {
		if (error) {
			throw(error)
		}
		else if (user) {
			user.forEach(userObj => {
				const newUser = new User({ 
					name: userObj.name || null,
					email: userObj.email || null ,
					nickname: userObj.nickname || null ,
					password: userObj.password || null ,
					resetPasswordToken: userObj.resetPasswordToken || null ,
					resetPasswordExpires: userObj.resetPasswordExpires || null ,
					height: userObj.height || null ,
					weight: userObj.weight || null ,
					preferredFoot: userObj.preferredFoot || 'Direito' ,
					profilePicture: userObj.profilePicture || null,
					_id: userObj._id
				})
	
				User.remove({ _id: userObj._id }, (error) => {
					if (error) {
						throw(error)
				  	}  
				  	else {
						newUser.save(error => {
							if (error) {
								throw(error)
							}
							else {
								console.log(`>> User ${newUser._id} migrated`)
							}
						})
					}
				})
			})
		}
		else {
			console.log('Users already updated')
		}
	})
}

const addNicknameField = async () => {
	console.log('> addNicknameField')
	await User.find({ nickname: { $exists: false } }, (error, user) => {
		if (error) {
			throw(error)
		}
		else if (user) {
			user.forEach(userObj => {
				const newUser = new User({ 
					name: userObj.name || null,
					email: userObj.email || null ,
					nickname: userObj.nickname || null ,
					password: userObj.password || null ,
					resetPasswordToken: userObj.resetPasswordToken || null ,
					resetPasswordExpires: userObj.resetPasswordExpires || null ,
					height: userObj.height || null ,
					weight: userObj.weight || null ,
					preferredFoot: userObj.preferredFoot || 'Direito' ,
					profilePicture: userObj.profilePicture || null,
					_id: userObj._id
				})
	
				User.remove({ _id: userObj._id }, (error) => {
					if (error) {
						throw(error)
				  	}  
				  	else {
						newUser.save(error => {
							if (error) {
								throw(error)
							}
							else {
								console.log(`>> User ${newUser._id} migrated`)
							}
						})
					}
				})
			})
		}
		else {
			console.log('Users already updated')
		}
	})
}

const removeResetPasswordFields = async () => {
	console.log('> removeResetPasswordFields')
	await User.find({ resetPasswordToken: { $exists: true }, resetPasswordExpires: { $exists: true } }, (error, user) => {
		if (error) {
			throw(error)
		}
		else {
			user.forEach(userObj => {
				const newUser = new User({ 
					name: userObj.name || null,
					email: userObj.email || null ,
					nickname: userObj.nickname || null ,
					password: userObj.password || null ,
					height: userObj.height || null ,
					weight: userObj.weight || null ,
					preferredFoot: userObj.preferredFoot || 'Direito' ,
					profilePicture: userObj.profilePicture || null,
					_id: userObj._id
				})

				User.remove({ _id: userObj._id }, (error) => {
					if (error) {
						throw(error)
					  }  
					  else {
						newUser.save(error => {
							if (error) {
								throw(error)
							}
							else {
								console.log(`>> User ${newUser._id} migrated`)
							}
						})
					}
				})
			})
		}
	})
}

module.exports = { addProfilePictureField, addNicknameField, removeResetPasswordFields }