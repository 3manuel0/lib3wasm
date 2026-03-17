let wasm;
const str_len = wasmlib.str_len;
const get_str = wasmlib.get_str;
let ddrawRectangle;
WebAssembly.instantiateStreaming(fetch("main.wasm"), {
  env: wasmlib.make_environment({
    jprintf: wasmlib.printf,
  }),
}).then((w) => {
  wasm = w;
  const { heap_base } = w.instance.exports;
  const buffer = wasm.instance.exports.memory.buffer;
  console.log(heap_base());
});
