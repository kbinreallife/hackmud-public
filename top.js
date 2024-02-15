function(context, args) {
	
	// hackmud lib
	let l = #fs.scripts.lib()

	// users.top leaderboard
	var t = #fs.users.top()

	// mongodb lookup
	let dat = #db.f({ 'users.top': { $exists:true } }).first()
	
	// function to reformat array of objects
	function data (top_array) {
		let my_rank = []
		for(var user of top_array) {
			let u = {
				rank : user.rank,
				name : user.name,
				balance : l.to_gc_num(user.balance),
				l_a : user.last_activity
			}
			my_rank.push(u)
		}
		return my_rank
	}

	// set our realtime lookup to variable 'top'
	let top = data(t)
	
	// initialize db article
	if(!dat) {
		#db.i({users: {top: top}})
		'users.top recorded'
	} else {
		
		// set database lookup to variable 'dat' to compare against 'top'
		dat = dat.users.top


		// if we have hit this block and then there is no db article, something has gone wrong. return error.
		if(!dat) {
			return { ok:false, error: 'Stored leaderboard data is undefined' }
		}

		// empty array we can store status messages in
		let changes = []

		// iterating over the arrays
		for(let i = 0; i < dat.length; i++) {
			let current_user = top[i]
			let db_user = dat.find(user => user.name === current_user.name)

			// if we do not have this name in the db, the user is new to the users.top leaderboard, push a message into our status message array.
			if(!db_user) {
				changes.push(`new appearance: ${current_user}`)
			} else {

				// if the user's current balance is different by 100 billion moneys, we want to know about it. push message.
				if(Math.abs(current_user.balance - db_user.balance) > 100000000000) {
					changes.push(`${current_user}'s balance changed: ${db_user.balance}`)
				}
				
				// if a user's rank is different than what we have stored, let me know.
				if (current_user.rank !== db_user.rank) {
					changes.push(`position change: ${db_user.rank} -> ${current_user.rank}`)
				}
			}
		}


		// quick pass over all the names to check if any left the leaderboard.
		for(let db_user of dat) {
			if(!top.find(user => user.name) == db_user.name) {
				changes.push(`Left users.top: ${db_user}`)
			}
		}

		// after we have collected all the data, update the array in the db so that we can check again in 1 hour when the bot_brain runs.
		#db.us({ 'users.top': { $exists:true } }, { $set: { users: {top: top} } })

		// create a final message
		let ret = changes.length > 0 ? changes.join('\n') : 'no changes detected on users.top'

		// send the message to a user who is plugged into my hackmud chatapi -> discord bots so I get status updates once an hour to my phone.
		return #ms.chats.tell({ to: "kb", msg: ret })
	}
}



