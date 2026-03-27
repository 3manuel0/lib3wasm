let wasm;
const str_len = wasmlib.str_len;
const get_str = wasmlib.get_str;
const terminal = document.getElementById("terminal");
const get_str_len = (str_ptr, len) => {
  const buffer = wasm.instance.exports.memory.buffer;
  console.log(str_ptr);
  const str_bytes = new Uint8Array(buffer, str_ptr, len);
  return new TextDecoder().decode(str_bytes);
};

let ddrawRectangle;
WebAssembly.instantiateStreaming(fetch("build/main.wasm"), {
  env: wasmlib.make_environment({
    // TODO: THIS IS A MESS, MAYBE I SHOULD REFACTOR IT
    jsprintf: (str_ptr, args_ptrs) => {
      const buffer = wasm.instance.exports.memory.buffer;
      const str = get_str(str_ptr);
      let f_str = "";
      for (let i = 0; i < str.length; i++) {
        if (str[i] === "%") {
          switch (str[i + 1]) {
            case "f":
              f_str += new Float32Array(buffer, args_ptrs, 1)[0];
              args_ptrs += 4;
              i += 2;
              break;
            case "d":
              f_str += new Int32Array(buffer, args_ptrs, 1)[0];
              args_ptrs += 4;
              i += 2;
              break;
            case "u":
              let uint = new Uint32Array(buffer, args_ptrs, 1)[0];
              f_str += uint;
              args_ptrs += 4;
              i += 2;
              break;
            case "s":
              const str_ptr = new Uint32Array(buffer, args_ptrs, 1)[0];
              f_str += get_str(str_ptr);
              args_ptrs += 4;
              i += 2;
              break;
            case "i":
              f_str += new Int32Array(buffer, args_ptrs, 1)[0];
              args_ptrs += 4;
              i += 2;
              break;
            case "p":
              let ptr = new Uint32Array(buffer, args_ptrs, 1)[0];
              f_str += "0x" + ptr.toString(16);
              args_ptrs += 4;
              i += 2;
              break;
            case "l":
              if (str[i + 2] === "d") {
                f_str += new BigInt64Array(buffer, args_ptrs, 1)[0];
                args_ptrs += 8;
                i += 3;
              } else if (str[i + 2] === "f") {
                f_str += new Float64Array(buffer, args_ptrs, 1)[0];
                args_ptrs += 8;
                i += 3;
              }
              break;
          }
        }
        if (str[i] != undefined) f_str += str[i];
      }
      // console.log(f_str);
      terminal.textContent += f_str;
      terminal.scrollTop = terminal.scrollHeight;
      // console.log(get_str(args_ptrs), new Uint32Array(buffer, args_ptrs, 1));
    },
    fwrite: (str_ptr, len, count, filedesc) => {
      const str = get_str_len(str_ptr, len * count);
      // console.log(str);
      terminal.textContent += str;
    },
  }),
}).then((w) => {
  wasm = w;
  const { heap_base, wmalloc, test, test2 } = w.instance.exports;
  // testing functions
  // console.log(test());
  console.log(test2());
  wmalloc(1000);
  // console.log(heap_base());
});
