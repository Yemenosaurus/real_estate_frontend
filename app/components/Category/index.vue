<script setup>
// Vous pouvez ajouter ici la logique nécessaire
</script>

<template>
    <section class="p-6 sm:p-20 font-poppins">
        <div class="text-center space-y-4">
            <p class="text-[#5E6282] text-lg uppercase">Our Services</p>
            <h2 class="font-volkhov font-bold text-5xl text-[#14183E]">
                Delivering Excellence
            </h2>
        </div>
        <div class="mt-16 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 place-items-center">
            <!-- État des lieux -->
            <div class="text-center space-y-4 group">
                <div class="relative w-max mx-auto">
                    <div
                        class="w-[100px] h-[100px] grid place-items-center relative z-10 group-hover:-translate-y-3 transition-transform">
                        <i class="fas fa-home w-20 h-20"></i>
                    </div>
                    <div
                        class="absolute -right-6 -bottom-4 w-[100px] h-[100px] bg-[#FFF1DA] rounded-tl-3xl rounded-br-3xl">
                    </div>
                </div>
                <h3 class="font-bold text-xl">État des lieux</h3>
                <p class="text-[#5E6282] text-base max-w-[180px]">
                    Comprehensive property inspections to ensure peace of mind and transparency.
                </p>
            </div>

            <!-- Rapidité et efficacité -->
            <div class="text-center space-y-4 group">
                <div class="relative w-max mx-auto">
                    <div
                        class="w-[100px] h-[100px] grid place-items-center relative z-10 group-hover:-translate-y-3 transition-transform">
                        <i class="fas fa-tachometer-alt w-20 h-20"></i>
                    </div>
                    <div
                        class="absolute -right-6 -bottom-4 w-[100px] h-[100px] bg-[#FFF1DA] rounded-tl-3xl rounded-br-3xl">
                    </div>
                </div>
                <h3 class="font-bold text-xl">Rapidité et efficacité</h3>
                <p class="text-[#5E6282] text-base max-w-[180px]">
                    Streamlined processes for quick and efficient service delivery.
                </p>
            </div>

            <!-- Flexibilité et digitalisation -->
            <div class="text-center space-y-4 group">
                <div class="relative w-max mx-auto">
                    <div
                        class="w-[100px] h-[100px] grid place-items-center relative z-10 group-hover:-translate-y-3 transition-transform">
                        <i class="fas fa-mobile-alt w-20 h-20"></i>
                    </div>
                    <div
                        class="absolute -right-6 -bottom-4 w-[100px] h-[100px] bg-[#FFF1DA] rounded-tl-3xl rounded-br-3xl">
                    </div>
                </div>
                <h3 class="font-bold text-xl">Flexibilité et digitalisation</h3>
                <p class="text-[#5E6282] text-base max-w-[180px]">
                    Digital solutions offering flexibility and convenience at your fingertips.
                </p>
            </div>

            <!-- Accessibilité et valeur ajoutée -->
            <div class="text-center space-y-4 group">
                <div class="relative w-max mx-auto">
                    <div
                        class="w-[100px] h-[100px] grid place-items-center relative z-10 group-hover:-translate-y-3 transition-transform">
                        <i class="fas fa-universal-access w-20 h-20"></i>
                    </div>
                    <div
                        class="absolute -right-6 -bottom-4 w-[100px] h-[100px] bg-[#FFF1DA] rounded-tl-3xl rounded-br-3xl">
                    </div>
                </div>
                <h3 class="font-bold text-xl">Accessibilité et valeur ajoutée</h3>
                <p class="text-[#5E6282] text-base max-w-[180px]">
                    Access anytime, anywhere, adding value to your property management.
                </p>
            </div>
        </div>
    </section>
</template>

<style scoped>
.category-card {
    background: white;
    transition: all 0.3s ease;
}

.category-card:hover {
    transform: translateY(-5px);
}
</style>