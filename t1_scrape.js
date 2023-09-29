function (c, a) {
    
    // Check if there are no args, or args are not 't'
    if (!a || !a.t) {

    // Return usage instructions if arguments are missing or 't' is missing
        return "\nusage: kbeeb.t1_scraper{t:#s.aon.public}\n\nadditional args:\n\ncheck:\"news\" - returns news page\ncheck:\"projects\" - returns project names found in this corp script";
    }
    
    //Our initial call
    var ret = a.t.call();
    
    // Check if the returned value contains "Shift" indicating a shift
    if (JSON.stringify(ret).includes("Shift")) {

        // Return an error object if a shift is detected
        return { ok: false, error: JSON.stringify(ret) };
    } else {

        // Decorrupt the initial result using 'kbeeb.decorrupt'
        var ret = #fs.kbeeb.decorrupt({ t: a.t });

        // Split the decorrupted result to extract news and mission information
        var news = ret.split("y.\n")[1].split(" |")[0];
        var mis = ret.split(" | ")[1].split(" |")[0];

        //Set args to empty object, call t2 corp with empty args
        var args = {};
        ret = #fs.kbeeb.decorrupt({ t: a.t, args: args });

        // Extract the 'key' and remove quotation marks
        var key = ret.split(":")[2].split("\n")[0];
        key = key.replace(/['"]+/g, '');

        // Extract the 'nav' word
        var nav = ret.split(":")[0].split("h ")[1];

        // Set 'args' to open the mission page
        args[nav] = mis;

        // Decorrupt the mission page
        var ret = #fs.kbeeb.decorrupt({ t: a.t, args: args });
        
        // Extract the password from the mission page
        var pass = ret.split("strategy ")[1].split(" ")[0];
        
        // Set 'args' to open the news page
        args[nav] = news;

        // Check if the user has passed the args to retrieve the news page
        if (a.check == "news") {

            // Set the 'news' property in 'args' and attempt to decorrupt
            [nav].news = args;
            try {
                // Return the decorrupted news page, splitting it
                return #fs.kbeeb.decorrupt({ t: a.t, args: args }).split(",2");

            // Handle errors and return a custom error message
            } catch (e) {
                return { ok: false, error: "Failed to decorrupt" };
            }
        }

        // Decorrupt the news page with updated 'args'
        ret = #fs.kbeeb.decorrupt({ t: a.t, args: args });
        ret = ret.split("\n");

        var proj = [];

        // Iterate over the decorrupted news page to find project names
        for (var entry of ret) {
            var found = "";
            var val = entry.includes(found);

            try {
                // Extract project names based on various patterns
                switch (val) {
                    case entry.includes("review of"):
                        found = entry.split("of ")[1].split(", the")[0];
                        proj.push(found);
                        break;
                    case entry.includes("developments on"):
                        found = entry.split("ts on ")[1].split(" p")[0];
                        proj.push(found);
                        break;
                    case entry.includes("Look for "):
                        found = entry.split("k for ")[1].split(" in")[0];
                        proj.push(found);
                        break;
                    case entry.includes("backstarters for "):
                        found = entry.split("for ")[1].split(" sin")[0];
                        proj.push(found);
                        break;
                    case entry.includes("of project "):
                        found = entry.split("ect ")[1].split(" has")[0];
                        proj.push(found);
                        break;
                    case entry.includes(" announces beta"):
                        found = entry.split(" announces beta")[0];
                        proj.push(found);
                        break;
                    case entry.includes("release date for"):
                        found = entry.split("date for ")[1].split(". ")[0];
                        proj.push(found);
                        break;
                    case entry.includes("in your mailbox"):
                        found = entry.split("Look for ")[1].split(" in you")[0];
                        proj.push(found);
                        break;
                    case entry.includes("continues on"):
                        found = entry.split("ues on ")[1].split(", h")[0];
                        proj.push(found);
                        break;
                    case entry.includes("wild success"):
                        found = entry.split(" of the ")[1].split(" software")[0];
                        proj.push(found);
                        break;
                }

            // Handle errors and return a custom error message
            } catch (e) {
                return { ok: false, error: "Failed to decorrupt" };
            }
        }

        var locs = [];

        // Iterate over the project names and retrieve location information
        for (var i = 0; i < proj.length; i++) {
            args.p = pass;
            args.pass = pass;
            args.password = pass;
            args[nav] = key;
            args.project = proj[i];
            locs.push(#fs.kbeeb.decorrupt({ t: a.t, args: args }));
        }

        // Initialize an empty 'clean' array for storing uncorrupted location information
        var clean = [];

        // Iterate over the location information and filter valid locations
        for (var i = 0; i < locs.length; i++) {
            if (!locs[i].includes(" ")) {
                clean.push(locs[i]);
            }
        }

        // Initialize an empty 'proj_names' array for storing project names
        var proj_names = [];

        // Check if the user wants to retrieve project names
        if (a.check == "projects") {
            for (let i = 0; i < proj.length; i++) {
                
                // Filter out null project names and add them to 'proj_names'
                if (proj[i] != null) {
                    proj_names.push(proj[i]);
                }
            }
            return proj_names;
        }

        // Initialize an empty 'final' array for formatting location output
        var final = [];

        // Iterate over 'clean' and split the uncorrupted locations
        for (var j = 0; j < clean.length; j++) {
            final.push(clean[j].split(","));
        }

        // Return the final uncorrupted t1 location array
        return final;
    }
}
