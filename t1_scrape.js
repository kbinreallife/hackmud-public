function (c, a){// t:#s.aon.public 								// <----------those are autocompletes that other players will see

	if(!a || !a.t){ 									//if the user has input no arguments, or if arguments are not {t:}, return usage docs

		return "\nusage: kbeeb.t1_scrape{t:#s.aon.public}\n\nadditional args:\n\ncheck:\"news\"     - returns news page\ncheck:\"projects\" - returns project names found in this corp script"
	}
	
	var ret = a.t.call()									//initial call

	if(JSON.stringify(ret).includes("Shift")){ 						//Check to see if corp script is shifting
		return {ok:false,error:JSON.stringify(ret)} 					//if so, return Shift message
	}else{ 											//if not shifting, continue execution
	
		var ret = #fs.kbeeb.decorrupt({t:a.t}) 						//send the call to decorruptor, set uncorrupted output to variable 'ret'

		var news = ret.split("y.\n")[1].split(" |")[0] 					//find news page, set to variable 'news'
		var mis = ret.split(" | ")[1].split(" |")[0] 					//find mission page, set to variable 'mis'
		
		var args = {} 									//empty object where we will assemble our arguments
		
		ret = #fs.kbeeb.decorrupt({t:a.t,args:args})       				//send updated arguments object to decorruptor for clean output, update variable 'ret'
								
		var key = ret.split(":")[2].split("\n")[0] 					// find keyword, set to variable 'key'
		key = key.replace(/['"]+/g, '') 						//strip quotation marks, update variable 'key'
		
		var nav = ret.split(":")[0].split("h ")[1] 					//find nav word, set to variable 'nav'
				
		args[nav] = mis 								//set args object to open mission page

		var ret = #fs.kbeeb.decorrupt({t:a.t,args:args}) 				//decorrupt mission page, set clean output to variable 'ret'

		var pass = ret.split("strategy ")[1].split(" ")[0] 				//find password in mission page, set to variable 'pass'
		
		args[nav] = news 								//set args to open news page

		if(a.check == "news"){ 								//user argument {check:"news"} returns decorrupted news page
			[nav].news = args
			try{									//try for error handling
				return #fs.kbeeb.decorrupt({t:a.t,args:args}).split(",2") 	//user return clean news page

			}catch(e){								//error handling
				return{ok:false,error:"Failed to decorrupt"} 			//return custom error message
			}
		}
				
		ret = #fs.kbeeb.decorrupt({t:a.t,args:args}) 					//send updated args to decorruptor, update variable 'ret'
		ret = ret.split("\n") 								//formats output into newlines for splitting strings later, update variable 'ret'
				
		var proj = [] 									//empty array that will be filled with projects, set to variable 'proj'

			for (var entry of ret){ 						//define variable 'entry' of object 'ret'
				
				var found = ""							//define variable 'found' as empty string
				var val = entry.includes(found) 			        //define variable 'val' as entry string for switch case
				
				try{								//try for error handling
				switch(val){ 							//switch case to find indicators of project names >> update 'found' to new string >> push into 'proj' array (beginning)

					case entry.includes("review of"):
						found = entry.split("of ")[1].split(", the")[0]
						proj.push(found)
						break
					case entry.includes("developments on"):
						found = entry.split("ts on ")[1].split(" p")[0]
						proj.push(found)
						break
					case entry.includes("Look for "):
						found = entry.split("k for ")[1].split(" in")[0]
						proj.push(found)
						break
					case entry.includes("backstarters for "):
						found = entry.split("for ")[1].split(" sin")[0]
						proj.push(found)
						break
					case entry.includes("of project "):
						found = entry.split("ect ")[1].split(" has")[0]
						proj.push(found)
						break
					case entry.includes(" announces beta"):
						found = entry.split(" announces beta")[0]
						proj.push(found)
						break
					case entry.includes("release date for"):
						found = entry.split("date for ")[1].split(". ")[0]
						proj.push(found)
						break
					case entry.includes("in your mailbox"):
						found = entry.split("Look for ")[1].split(" in you")[0]
						proj.push(found)
						break
					case entry.includes("continues on"):
						found = entry.split("ues on ")[1].split(", h")[0]
						proj.push(found)
						break
					case entry.includes("wild success"):
						found = entry.split(" of the ")[1].split(" software")[0]
						proj.push(found)
						break																									
				}								//switch case to find indicators of project names >> update variable 'found' to new string >> push into 'proj' array (end)

				}catch(e){ 							//error handling
					return{ok:false,error:"Failed to decorrupt"}		//return custom error message
				}
			}

			var locs = [] 							        //empty array we will fill with t1 locs

			for(var i = 0; i < proj.length; i++){ 					//iterate through project array and pass full arguments to get locs >> push into `locs` array
				args.p = pass
				args.pass = pass
				args.password = pass 						//specify 3 possible password args
				args[nav] = key
				args.project = proj[i]						//assign each found project name to the value of property 'project' in arguments object
				locs.push(#fs.kbeeb.decorrupt({t:a.t,args:args}))
			}
			
			var clean = [] 								//empty array we will fill with uncorrupted locs, set to variable 'clean'

			for(var i = 0; i < locs.length; i++){ 					//iterate over original array 'locs'
				if(!locs[i].includes(" ")){					//if a string in the 'locs' array does not contain a space, we can be certain it is a valid loc
					clean.push(locs[i])					//pushing valid locs into new array 'clean'
				}
			}
			
			var proj_names = []							//an empty array we will fill with project names, set to variable 'proj_names'

			if(a.check == "projects"){ 						//argument {check:"projects"} allows user to return found project names

				for(let i = 0; i < proj.length; i++){				//iterate over original array 'proj'
					if(proj[i] != null){					//finds each project name in array 'proj' that is not 'null'
						proj_names.push(proj[i])			//pushes valid project names into new array 'proj_names'
					}
				}
				return proj_names						//user returned valid project names
			}

			var final = [] 								//final empty array for formatting loc output, set to variable 'final'

			for(var j = 0; j < clean.length; j++){					//iterate over array 'clean'
				final.push(clean[j].split(",")) 				//pushes uncorrupted locs as individual array entries for final return
			}

			return final 								// returns our final uncorrupted t1 loc array
	}	
}
