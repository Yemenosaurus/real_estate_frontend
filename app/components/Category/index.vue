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
                    <div class="w-[100px] h-[100px] relative z-10 group-hover:-translate-y-3 transition-transform">
                        <Icon name="heroicons:home" class="w-12 h-12 text-[#6C63FF] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                    </div>
                    <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[100px] h-[100px] bg-[#ECEBFF] rounded-tl-3xl rounded-br-3xl -z-10"></div>
                </div>
                <h3 class="font-bold text-xl">État des lieux</h3>
                <p class="text-[#5E6282] text-base max-w-[180px] mx-auto">
                    Comprehensive property inspections to ensure peace of mind and transparency.
                </p>
            </div>

            <!-- Rapidité et efficacité -->
            <div class="text-center space-y-4 group">
                <div class="relative w-max mx-auto">
                    <div class="w-[100px] h-[100px] relative z-10 group-hover:-translate-y-3 transition-transform">
                        <Icon name="heroicons:rocket-launch" class="w-12 h-12 text-[#6C63FF] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                    </div>
                    <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[100px] h-[100px] bg-[#ECEBFF] rounded-tl-3xl rounded-br-3xl -z-10"></div>
                </div>
                <h3 class="font-bold text-xl">Rapidité et efficacité</h3>
                <p class="text-[#5E6282] text-base max-w-[180px] mx-auto">
                    Streamlined processes for quick and efficient service delivery.
                </p>
            </div>

            <!-- Flexibilité et digitalisation -->
            <div class="text-center space-y-4 group">
                <div class="relative w-max mx-auto">
                    <div class="w-[100px] h-[100px] relative z-10 group-hover:-translate-y-3 transition-transform">
                        <Icon name="heroicons:device-phone-mobile" class="w-12 h-12 text-[#6C63FF] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                    </div>
                    <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[100px] h-[100px] bg-[#ECEBFF] rounded-tl-3xl rounded-br-3xl -z-10"></div>
                </div>
                <h3 class="font-bold text-xl">Flexibilité et digitalisation</h3>
                <p class="text-[#5E6282] text-base max-w-[180px] mx-auto">
                    Digital solutions offering flexibility and convenience at your fingertips.
                </p>
            </div>

            <!-- Accessibilité et valeur ajoutée -->
            <div class="text-center space-y-4 group">
                <div class="relative w-max mx-auto">
                    <div class="w-[100px] h-[100px] relative z-10 group-hover:-translate-y-3 transition-transform">
                        <Icon name="heroicons:chart-bar" class="w-12 h-12 text-[#6C63FF] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                    </div>
                    <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[100px] h-[100px] bg-[#ECEBFF] rounded-tl-3xl rounded-br-3xl -z-10"></div>
                </div>
                <h3 class="font-bold text-xl">Accessibilité et valeur ajoutée</h3>
                <p class="text-[#5E6282] text-base max-w-[180px] mx-auto">
                    Digital solutions offering flexibility and convenience at your fingertips.
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