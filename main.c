#include "wheap.h"

unsigned char * HEAP_BASE = &__heap_base;
unsigned long PAGE_LEN = KiB(64);

unsigned char *heap_base(){
    jprintf("%d %d", HEAP_BASE, PAGE_LEN);
    __builtin_wasm_memory_grow(0, 1);
    jprintf("%d %d", HEAP_BASE, __builtin_wasm_memory_size(0));
    return HEAP_BASE;
}

