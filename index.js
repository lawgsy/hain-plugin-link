/*eslint prefer-const: "error"*/
/*eslint-env es6*/

'use strict';

const DEFAULT_ITEMS = [{
  id: "list",
  title: "List all",
  desc: "#list",
  redirect: "#list",
  group: "default"
}, {
  id: "list",
  title: "To add (example):",
  desc: "#add google http://www.google.com/",
  redirect: "#",
  group: "default"
}, {
  id: "list",
  title: "To launch (example):",
  desc: "#google",
  redirect: "#",
  group: "default"
}, {
  id: "list",
  title: "To remove (irreversible!) (example):",
  desc: "#remove google",
  redirect: "#",
  group: "default"
}];

module.exports = (context) => {
  const shell = context.shell;
  const toast = context.toast;
  const app = context.app;
  const localStorage = context.localStorage;
  let _links = {};

  function startup() {
    // Load existing items or create defaults
    if (localStorage.getItemSync('links') === undefined) {
      // Examples of default links
      _links = {
        'google':      'http://www.google.com/',
        'youtube':     'http://www.youtube.com/',
        'xkcd':        'http://www.xkcd.com/',
        'hain-repo':   'https://github.com/appetizermonster/hain',
        'hain-gitter': 'https://gitter.im/appetizermonster/hain',
        'npmjs':       'http://npmjs.com',
        'cmd':         'cmd'
      };
      _links = {};

      localStorage.setItem('links', _links);
    } else {
      _links = localStorage.getItem('links')
    }
  }

  // show array of (sorted) items with groupname as a name
  function show_res(res, items, groupname) {
    for(var i=0; i<items.length; ++i) // list matching commands
      res.add({
        id: items[i],
        title: `<b>#${items[i]}</b>`,
        desc: `<b>${_links[items[i]]}</b>`,
        payload: _links[items[i]],
        redirect: `#${items[i]}`,
        group: groupname
      });
  }

  function search(query, res) {
    query = query.trim().toLowerCase();
    if(query != "") {
      const split_query = query.split(' ');

      // if not a command, list matches for query
      if(["list", "remove", "add"].indexOf(split_query[0]) == -1) {
        if(Object.keys(_links).length === 0) { // no available links
          res.add({ title: "No links exist. Add one or more.", desc: "Links" });
        } else {
          // filter matches and sort results
          var candidates = Object.keys(_links).sort().filter(function(name) {
            return ~name.toLowerCase().indexOf(split_query[0])
          });

          if(candidates.length == 0)
            res.add({ title: "No matching links", group: 'Matching links' });
          else
            show_res(res, candidates, 'Matching links');
        }
      } else {
        const command = split_query.shift();
        if(command=="list") { // list all commands
          var sorted = Object.keys(_links).sort();
          show_res(res, sorted, 'All links');
        } else { // add or remove given command
          res.add({
            id: command,
            title: `<b>#${command}</b> ${split_query.join(' ')}`,
            desc: "Links",
            payload: split_query,
            preview: false,
            group: 'Matching command'
          });
          var sorted = Object.keys(_links).sort();
          show_res(res, sorted, 'Existing links');
        }
      }
    } else {
      res.add({ title: "No query given", desc: "Links" });
    }

    // Defaults at the bottom
    res.add(DEFAULT_ITEMS);
  }

  function execute(id, payload) {
    let hasMatched = true;
    switch(id) {
      case "list": app.setQuery('#list'); break;
      case "remove":
        console.log(payload[0], Object.keys(_links))
        if(Object.keys(_links).indexOf(payload[0]) != -1) {
          delete _links[payload[0]];
          localStorage.setItem('links', _links);
          app.setQuery('#remove ');
          toast.enqueue(`${payload} removed.`);
        } else {
          toast.enqueue(`Error: ${payload} does not exist.`);
        }
        break;
      case "add":
        const link = payload.shift();
        if(Object.keys(_links).indexOf(link) == -1) { // doesn't exist
          if(["list","add","remove"].indexOf(link) == -1) { // not reserved
            _links[link] = payload.join(' ');

            localStorage.setItem('links', _links);
            app.setQuery('#add ');
            toast.enqueue(`${link} now links to '${payload.join(' ')}'`);
          } else {
            toast.enqueue(`Error: ${payload[0]} is a reserved link.`);
          }
        } else {
          toast.enqueue(`Error: ${payload[0]} already exists as a link.`);
        }
        break;
      default:
        hasMatched = false;
    }
    if(payload === undefined || hasMatched) return;

    // link given
    shell.openExternal(payload);
  }

  return { startup, search, execute };
};
