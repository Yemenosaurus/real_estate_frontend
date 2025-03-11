<script setup></script>

<template>
  <section class="p-6 sm:p-20 font-poppins">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-20">
      <div class="space-y-8">
        <p class="text-[#5E6282] text-lg uppercase">Testimonials</p>
        <h2 class="font-volkhov font-bold text-5xl text-[#14183E]">
          What People Say About Us.
        </h2>
      </div>
      <div class="space-y-8">
        <div class="bg-white rounded-xl p-8 shadow-lg">
          <nuxt-picture
            src="/images/testimonial.jpg"
            alt="Testimonial 1"
            class="w-16 h-16 rounded-full object-cover"
          />
          <p class="mt-8 text-[#5E6282] text-base">
            "On the Windows talking painted pasture yet its express parties use.
            Sure last upon he same as knew next. Of believed or diverted no."
          </p>
          <div class="mt-8">
            <h3 class="font-semibold text-lg text-[#5E6282]">Mike Taylor</h3>
            <p class="text-[#5E6282]">Lahore, Pakistan</p>
          </div>
        </div>
        <div class="bg-white rounded-xl p-8 shadow-lg">
          <nuxt-picture
            src="/images/testimonial2.jpg"
            alt="Testimonial 2"
            class="w-16 h-16 rounded-full object-cover"
          />
          <p class="mt-8 text-[#5E6282] text-base">
            "On the Windows talking painted pasture yet its express parties use.
            Sure last upon he same as knew next. Of believed or diverted no."
          </p>
          <div class="mt-8">
            <h3 class="font-semibold text-lg text-[#5E6282]">Chris Thomas</h3>
            <p class="text-[#5E6282]">CEO of Red Button</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template> 