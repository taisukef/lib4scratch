// CC BY fukuno.jig.jp
"use strict";

const setFileDrop = function(callback, errcallback) {
	if (!window.File) {
		window.alert("can't use File API on your browser")
		return
	}
	var drop = document.body
	drop.addEventListener("dragover", function(e) {
		e.preventDefault()
	}, false);
	drop.addEventListener("drop", function(e) {
		var files = event.dataTransfer.files
		if (files.length > 0) {
			var f = files[0]
			var reader = new FileReader()
			reader.onerror = function(e) {
				errcallback("reader onerror")
			}
			console.log(f)
			reader.f = f;
			reader.onload = function(e) {
				try {
					const unzip = new Zlib.Unzip(new Uint8Array(e.target.result))
					const filenames = unzip.getFilenames()
					const bytes = unzip.decompress("project.json")
					const decoder = new TextDecoder("utf-8");
					const sjson = decoder.decode(Uint8Array.from(bytes).buffer);
					const json = JSON.parse(sjson)
					console.log(json)
					if (json.targets) { // is sb3
						callback(json)
					} else {
						errcallback("not sb3 file")
					}
				} catch (e) {
					errcallback("not zip file")
				}
			};
			reader.readAsArrayBuffer(f)
		}
		e.preventDefault()
	})
}

const getCountBlocks2 = function(data) { // under construction
	var blkcnt = 0
	for (var i = 0; i < data.children.length; i++) {
		const scs = data.children[i].scripts
		if (scs) {
			blkcnt += scs.length
		}
	}
	return blkcnt
}
const getCountBlocks = function(data) {
	//dump(data)

	if (data.info) { // for sb2
		return -1 // getCountBlocks2(data)
	}
	//return

	const target = data.targets
//		alert(target.length)
	var blkcnt = 0
	for (var i = 0; i < target.length; i++) {
		const t = target[i]
		const name = t.name

		const vars = t.variables
		const blocks = t.blocks
//		console.log(i,name, blocks.length)
		
		var cnt = 0
		for (var id in blocks) {
			const b = blocks[id]
			if (!b.parent) {
//					showBlock(b)
				console.log(b.opcode, id)
			}
			cnt++
		}
		blkcnt += cnt
//		console.log(cnt)
		
		/*
		const showBlock = function(b) {
			console.log(b.opcode)
			if (b.next) {
				showBlock(blocks[b.next])
			}
		}

		alert(cnt)
		*/
	}
	return blkcnt
}
