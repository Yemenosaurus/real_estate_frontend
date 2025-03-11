<script setup>
// Bookings component logic
</script>

<template>
  <section class="p-6 sm:p-20 font-poppins">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-20">
      <div class="space-y-8">
        <p class="text-[#5E6282] text-lg uppercase">Easy and Fast</p>
        <h2 class="font-volkhov font-bold text-5xl text-[#14183E]">
          How Our Booking System Works
        </h2>
        <div class="space-y-12">
          <!-- Step 1: Easy Identification -->
          <div class="flex items-start space-x-5">
            <div
              class="shrink-0 w-12 h-12 rounded-xl bg-[#F0BB1F] grid place-items-center"
            >
              <Icon name="choose" class="w-5 h-5" />
            </div>
            <div class="space-y-1">
              <h3 class="font-bold text-base">Step 1: Easy Identification</h3>
              <p class="text-[#5E6282] text-base">
                Quickly identify yourself and your needs. Our intuitive form guides you through selecting the type of inspection you require, ensuring a personalized experience tailored to your specific needs.
              </p>
            </div>
          </div>
          <!-- Step 2: Comprehensive Property Configuration -->
          <div class="flex items-start space-x-5">
            <div
              class="shrink-0 w-12 h-12 rounded-xl bg-[#F15A2B] grid place-items-center"
            >
              <Icon name="payment" class="w-5 h-5" />
            </div>
            <div class="space-y-1">
              <h3 class="font-bold text-base">Step 2: Comprehensive Property Configuration</h3>
              <p class="text-[#5E6282] text-base">
                Configure your property details with ease. Our platform allows you to specify every aspect of your property, from main rooms to additional elements, ensuring a thorough and accurate inspection.
              </p>
            </div>
          </div>
          <!-- Step 3: Seamless Appointment Scheduling -->
          <div class="flex items-start space-x-5">
            <div
              class="shrink-0 w-12 h-12 rounded-xl bg-[#006380] grid place-items-center"
            >
              <Icon name="car" class="w-5 h-5" />
            </div>
            <div class="space-y-1">
              <h3 class="font-bold text-base">Step 3: Seamless Appointment Scheduling</h3>
              <p class="text-[#5E6282] text-base">
                Schedule your appointment effortlessly. Choose a date and time that suits you, and receive a confirmation instantly. Our system ensures you are always informed and prepared for your inspection.
              </p>
            </div>
          </div>
        </div>
      </div>
      <div class="relative">
        <nuxt-picture
          src="/images/mobile-app.png"
          alt="Mobile App"
          class="w-full h-auto object-cover"
        />
      </div>
    </div>
  </section>
</template>

<style scoped>
/* Styles spécifiques aux réservations */
</style> 