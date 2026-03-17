let wasm;
const str_len = wasmlib.str_len;
const get_str = wasmlib.get_str;
let ddrawRectangle;
WebAssembly.instantiateStreaming(fetch("main.wasm"), {
  env: wasmlib.make_environment({
    jprintf: (str_ptr, args_ptrs) => {
      const buffer = wasm.instance.exports.memory.buffer;
      const str = get_str(str_ptr);
      let f_str = "";
      let args = [];
      let argsIndex = 0;
      for (let i = 0; i < str.length; i++) {
        if (str[i] === "%") {
          switch (str[i + 1]) {
            case "f":
              let float = new Float64Array(buffer, args_ptrs + argsIndex, 1)[0];
              args.push(float);
              f_str += float;
              argsIndex += 8;
              i += 2;
              break;
            case "d":
              let int = new Int32Array(buffer, args_ptrs + argsIndex, 1)[0];
              args.push(int);
              f_str += int;
              argsIndex += 4;
              i += 2;
              break;
            case "u":
              let uint = new Uint32Array(buffer, args_ptrs + argsIndex, 1)[0];
              args.push(uint);
              f_str += uint;
              argsIndex += 4;
              i += 2;
              break;
            case "s":
              const str_ptr = new Uint32Array(
                buffer,
                args_ptrs + argsIndex,
                1,
              )[0];
              let str = get_str(str_ptr);
              args.push(str);
              f_str += str;
              argsIndex += 4;
              i += 2;
              break;
            case "i":
              let iint = new Int32Array(buffer, args_ptrs + argsIndex, 1)[0];
              args.push(iint);
              f_str += iint;
              argsIndex += 4;
              i += 2;
              break;
            case "p":
              let ptr = args_ptrs + argsIndex;
              args.push(ptr);
              f_str += ptr;
              argsIndex += 4;
              i += 2;
              break;
          }
        }
        if (str[i] != undefined) f_str += str[i];
      }
      console.log(f_str);
      // console.log(get_str(args_ptrs), new Uint32Array(buffer, args_ptrs, 1));
    },
  }),
}).then((w) => {
  wasm = w;
  const { heap_base, wmalloc } = w.instance.exports;
  console.log(wmalloc(500));
  console.log(wmalloc(1564000));
  console.log(wmalloc(64000));
  console.log(wmalloc(64000));
  console.log(wmalloc(64000));
  console.log(wmalloc(64000));
  console.log(wmalloc(64000));
  const buffer = wasm.instance.exports.memory.buffer;
  console.log(heap_base());
});
