<template>
    <section class="p-6 sm:p-20 font-poppins">
      <div
        class="w-full max-w-[1170px] mx-auto bg-[#DFD7F9] rounded-tl-[129px] rounded-[20px] p-16 relative"
      >
        <div class="absolute -right-10 -top-10">
          <Icon name="send-2" class="w-[70px] h-[70px]" />
        </div>
        <div class="absolute right-52 bottom-0">
          <Icon name="send-3" class="w-[70px] h-[70px]" />
        </div>
        <div class="text-center space-y-12 max-w-[880px] mx-auto">
          <p class="text-[#5E6282] text-[33px] font-semibold">
            Subscribe to receive insights and updates on optimizing and enhancing your property experience with us.
          </p>
          <div class="flex items-center space-x-6">
            <div class="relative w-full max-w-[421px]">
              <input
                type="email"
                placeholder="Your email"
                class="w-full h-[68px] rounded-xl px-16"
              />
              <Icon
                name="email"
                class="w-6 h-6 absolute left-6 top-1/2 -translate-y-1/2"
              />
            </div>
            <button
              class="h-[68px] px-12 bg-gradient-to-t from-[#FF946D] to-[#FF7D68] text-white rounded-xl"
            >
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </section>
  </template> 