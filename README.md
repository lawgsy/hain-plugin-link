# hain-plugin-link

A plugin for managing links (or 'shortcuts'). Will open anything in default program. That is, any protocol URL (local filepath, directory path, external URL, etc).

## Usage example:

1. `#list` lists currently available links (if any)
2. `#add google http://www.google.com/` adds `#google` as a link
3. `#add cc C:\Program Files\CCleaner\CCleaner64.exe` adds `#cc` as a link
4. `#google` launches `http://www.google.com/` in the default browser
5. `#cc` launches CCleaner
6. `#remove google` removes `#google` link

## Install

Type this command in the Hain input:

```
/hpm install hain-plugin-link
```

## Usage

Command   | Arguments           | Result
--------- | ------------------- | ----------------------------------------------
`#`       | _[link]_            | launch the _[target]_ that _[link]_ points at
`#add`    | _[link]_ _[target]_ | link _[link]_ to _[target]_ (persistent)
`#remove` | _[link]_            | remove _[link]_ (**warning**: no confirmation)
`#list`   |                     | list all current links

Links must be a single word (no spaces) and must not already exist. Built-in commands (add, remove, list) are reserved and cannot be used. Filepaths to executables can be with either forward or backward slashes, or even spaces.

## ToDo

- Add icons depicting the types of links.
- Allow shortcuts to be given arguments (eg. a query)
- Check if the given target is valid(?)
- Option to override 'link already exists'
- Option to conform removal

## In-depth Examples

Linking `#vpn` to the shortcut `Cisco AnyConnect Secure Mobility Client` would be possible by rightclicking your cisco shortcut (not through Hain), copying the target out of the properties of the shortcut and then: `#add vpn "C:\Whatever\The\Path\To\Your\File\Is.exe"` resulting in a persistent command (stored in Hain's localstorage): `#vpn`

To remove it again you'd use `#remove vpn`

More examples: `#add google www.google.com` results in `#google` opening google in your default browser `#add cmd cmd` results in `#cmd` opening a command prompt (in the hain directory, though)

If this will currently suffice as a solution (even if it won't, to be honest), I'll share the code soon.

### Worth to mention:

- I have only tested this on Windows
- Paths will not be checked to see if they exist
- Apart from URLs and file paths, this also works for single commands recognized by the commandline, but I have yet to figure out if parameters can be passed

  - You can pass parameters by manually creating a shortcut, though this is far from nice:

    - `#add test file:///C:\some-shortcut.lnk` with `some-shortcut.lnk` having the target `ping google.com` will result in `#test` pinging google indefinitely

- You can use file paths to non-executables (and they will be opened in a default application)

  - Example: `#add test file:///C:\Users\Public\Desktop\test.txt` will make `#test` open the textfile with your default text editor

The above two examples use the file:/// protocol. the **three** slashes are all necessary

## Credit

Plugin by Lawgsy ([lawgsy@gmail.com](mailto:lawgsy@gmail.com)).
