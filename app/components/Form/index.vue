<script setup>
import { ref, computed, watch } from 'vue';
import DatePicker from '../DatePicker.client.vue';
import axios from 'axios';

const currentStep = ref(1);
const totalSteps = 6;

const nextStep = () => {
    if (currentStep.value < totalSteps) {
        currentStep.value++;
    }
};

const prevStep = () => {
    if (currentStep.value > 1) {
        currentStep.value--;
    }
};

// Formulaire principal
const formData = ref({
    estateId: null,
    userId: null,
    status: 'Submitted',
    who: '',
    config: '',
    date: '',
    comments: '',
    level: '',
    roomType: '',
    roomCount: 0,
    additionalInfo: '',
    details: '',
    pieces: '',
    estate_name: '',
    location: '',
    price: '',
    has_description: false,
    description: ''
});

// Configuration des étages
const numFloors = ref(0);
const floorsConfig = ref([]);

// Surveiller les changements du nombre d'étages
watch(numFloors, (newVal) => {
    floorsConfig.value = [];
    for (let i = 0; i < newVal; i++) {
        floorsConfig.value.push({
            name: '', // Nom personnalisable de l'étage
            rooms: {}
        });
    }
});

const store = async () => {
    try {
        console.log('Store function called');
        const userId = localStorage.getItem('userId');
        
        if (!userId) {
            console.error('User ID not found in localStorage');
            return;
        }

        // Formater la config pour le backend
        const formattedConfig = {};
        floorsConfig.value.forEach((floor) => {
            if (!floor.name) {
                console.error('Floor name is required');
                return;
            }
            const roomEntries = [];
            for (const [roomType, quantity] of Object.entries(floor.rooms)) {
                roomEntries.push(`${roomType}|${quantity}`);
            }
            formattedConfig[floor.name] = roomEntries;
        });

        const response = await axios.post('http://127.0.0.1:8000/api/property-inspections', {
            estate_id: formData.value.estateId,
            user_id: userId,
            status: formData.value.status,
            who: formData.value.who,
            date: appointmentDate.value,
            comments: appointmentNote.value,
            level: formData.value.level,
            room_type: formData.value.roomType,
            room_count: formData.value.roomCount,
            additional_info: formData.value.additionalInfo,
            details: formData.value.details,
            pieces: formData.value.pieces,
            estate_name: formData.value.estate_name,
            location: formData.value.location,
            price: formData.value.price,
            description: formData.value.has_description ? formData.value.description : '',
            config: JSON.stringify(formattedConfig)
        });

        console.log('Property Inspection Created:', response.data);
        currentStep.value = 6;
    } catch (error) {
        if (error.response && error.response.status === 422) {
            console.error('Validation errors:', error.response.data.errors);
        } else {
            console.error('Error creating property inspection:', error);
        }
    }
};

const submitForm = () => {
    store(); // Appeler la fonction store lors de la soumission du formulaire
};

const userType = ref('');
const propertyConfig = ref({
    mainRooms: [],
    technicalRooms: [],
    exteriors: [],
    additionalElements: [],
    others: ''
});

const roomTypes = {
    mainRooms: ['Entrée', 'Salon', 'Salle à manger', 'Chambres', 'Bureaux'],
    technicalRooms: ['Cuisine', 'Salle de bain', 'WC', 'Buanderie', 'Garage', 'Cave', 'Grenier'],
    exteriors: ['Balcon', 'Terrasse', 'Jardin', 'Cour', 'Piscine', 'Espace'],
    additionalElements: ['Couloirs', 'Escaliers', 'Placards', 'Locaux techniques']
};

const appointmentDate = ref(null);
const appointmentTime = ref('');
const appointmentNote = ref('');

// Fonction pour basculer une pièce dans un étage
const toggleRoom = (floorIndex, room) => {
    if (!floorsConfig.value[floorIndex].rooms[room]) {
        floorsConfig.value[floorIndex].rooms[room] = 1;
    } else {
        delete floorsConfig.value[floorIndex].rooms[room];
    }
};

// Fonction pour mettre à jour la quantité d'une pièce
const updateRoomQuantity = (floorIndex, room, quantity) => {
    floorsConfig.value[floorIndex].rooms[room] = parseInt(quantity) || 0;
};
</script>

<template>
    <section class="form-section p-6 font-poppins">
        <div class="form-container rounded-xl shadow-md overflow-hidden">
            <div class="p-8 stepper-container">
                <!-- Stepper Indicator -->
                <div class="flex justify-between items-center mb-8">
                    <div class="text-white font-semibold text-lg">
                        Step {{ currentStep }} of {{ totalSteps }}
                    </div>
                    <div class="flex space-x-2">
                        <div v-for="step in totalSteps" :key="step" class="w-8 h-2 rounded-full"
                            :class="step <= currentStep ? 'bg-white' : 'bg-gray-400'"></div>
                    </div>
                </div>

                <!-- Step Content -->
                <div v-if="currentStep === 1" class="grid md:grid-cols-2 gap-8 items-start">
                    <!-- Colonne de gauche avec le select -->
                    <div class="space-y-6">
                        <div>
                            <h3 class="uppercase tracking-wide text-2xl text-white font-bold mb-2">Who Are You?</h3>
                            <p class="text-white text-sm opacity-90 mb-6">
                        Please select who is requesting the property inspection.
                    </p>
                            
                            <div class="relative">
                                <img src="@/assets/images/who.png" alt="Who are you" class="w-64 mx-auto mb-6" />
                                <select v-model="formData.who"
                                    class="mt-4 block w-full border-2 border-white bg-transparent text-white rounded-lg py-3 px-4 shadow-sm focus:ring-2 focus:ring-white focus:border-white text-lg">
                                    <option value="" disabled class="text-gray-700">Select an option</option>
                                    <option value="particulier" class="text-gray-700">Particulier</option>
                                    <option value="agence" class="text-gray-700">Agence</option>
                                    <option value="investisseur" class="text-gray-700">Investisseur</option>
                        </select>
                            </div>
                        </div>
                    </div>

                    <!-- Colonne de droite avec les champs additionnels -->
                    <transition name="fade">
                        <div v-if="formData.who" class="space-y-6">
                            <img src="@/assets/images/select.png" alt="Estate details" class="w-64 mx-auto mb-6" />
                            <div class="grid grid-cols-1 gap-6">
                                <div class="form-group">
                                    <label class="block text-white text-sm font-medium mb-2">Estate Name</label>
                                    <input type="text" v-model="formData.estate_name"
                                        class="w-full border-2 border-white bg-transparent text-white rounded-lg py-2 px-4 focus:ring-2 focus:ring-white focus:border-white"
                                        placeholder="Enter estate name" />
                                </div>

                                <div class="form-group">
                                    <label class="block text-white text-sm font-medium mb-2">Location</label>
                                    <input type="text" v-model="formData.location"
                                        class="w-full border-2 border-white bg-transparent text-white rounded-lg py-2 px-4 focus:ring-2 focus:ring-white focus:border-white"
                                        placeholder="Enter address" />
                                </div>

                                <div class="form-group">
                                    <label class="block text-white text-sm font-medium mb-2">Price</label>
                                    <input type="number" v-model="formData.price"
                                        class="w-full border-2 border-white bg-transparent text-white rounded-lg py-2 px-4 focus:ring-2 focus:ring-white focus:border-white"
                                        placeholder="Enter price" />
                                </div>

                                <div class="form-group">
                                    <div class="flex items-center mb-2">
                                        <input type="checkbox" v-model="formData.has_description" class="w-4 h-4 mr-2" />
                                        <label class="text-white text-sm font-medium">Add Description</label>
                                    </div>
                                    <textarea v-if="formData.has_description" v-model="formData.description"
                                        class="w-full border-2 border-white bg-transparent text-white rounded-lg py-2 px-4 focus:ring-2 focus:ring-white focus:border-white"
                                        placeholder="Enter description" rows="3"></textarea>
                                </div>
                            </div>
                        </div>
                    </transition>
                </div>

                <!-- Step 2: Configuration des étages -->
                <div v-if="currentStep === 2" class="grid md:grid-cols-2 gap-8 items-start">
                    <!-- Colonne de gauche -->
                    <div class="space-y-6">
                        <div>
                            <h3 class="uppercase tracking-wide text-2xl text-white font-bold mb-2">Floor Configuration</h3>
                            <p class="text-white text-sm opacity-90 mb-6">
                                Please specify the number of floors and their configuration.
                            </p>
                            
                            <div class="relative">
                                <img src="@/assets/images/config.png" alt="Floor configuration" class="w-64 mx-auto mb-6" />
                                <div class="form-group">
                                    <label class="block text-white text-lg font-medium mb-2">Number of Floors</label>
                                    <input type="number" v-model.number="numFloors" min="1"
                                        class="w-full border-2 border-white bg-transparent text-white rounded-lg py-3 px-4 focus:ring-2 focus:ring-white focus:border-white text-lg"
                                        placeholder="Enter number of floors" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Colonne de droite -->
                    <div v-if="numFloors > 0" class="space-y-6 max-h-[500px] overflow-y-auto pr-4" style="scrollbar-width: thin;">
                        <div v-for="(floor, floorIndex) in floorsConfig" :key="floorIndex"
                            class="p-6 bg-white bg-opacity-10 rounded-lg border-2 border-white mb-6 last:mb-0">
                            <h4 class="text-white font-semibold text-xl mb-6">Floor {{ floorIndex + 1 }}</h4>

                            <!-- Sections de pièces -->
                            <div class="grid grid-cols-2 gap-6">
                                <!-- Main Rooms -->
                                <div>
                                    <h5 class="text-white font-medium text-lg mb-4">Main Rooms</h5>
                                    <div class="space-y-3">
                                        <div v-for="room in roomTypes.mainRooms" :key="room" 
                                            class="flex items-center justify-between space-x-4">
                                            <div class="flex items-center">
                                                <input type="checkbox" :checked="floor.rooms[room] !== undefined"
                                                    @change="toggleRoom(floorIndex, room)"
                                                    class="w-4 h-4 mr-2" />
                                                <span class="text-white">{{ room }}</span>
                                            </div>
                                            <input v-if="floor.rooms[room] !== undefined" 
                                                type="number"
                                                v-model="floor.rooms[room]" 
                                                min="1"
                                                class="w-20 border-2 border-white bg-transparent text-white rounded-lg py-1 px-2 focus:ring-2 focus:ring-white focus:border-white" />
                                        </div>
                                    </div>
                                </div>

                                <!-- Technical Rooms -->
                                <div>
                                    <h5 class="text-white font-medium text-lg mb-4">Technical Rooms</h5>
                                    <div class="space-y-3">
                                        <div v-for="room in roomTypes.technicalRooms" :key="room" 
                                            class="flex items-center justify-between space-x-4">
                                            <div class="flex items-center">
                                                <input type="checkbox" :checked="floor.rooms[room] !== undefined"
                                                    @change="toggleRoom(floorIndex, room)"
                                                    class="w-4 h-4 mr-2" />
                                                <span class="text-white">{{ room }}</span>
                                            </div>
                                            <input v-if="floor.rooms[room] !== undefined" 
                                                type="number"
                                                v-model="floor.rooms[room]" 
                                                min="1"
                                                class="w-20 border-2 border-white bg-transparent text-white rounded-lg py-1 px-2 focus:ring-2 focus:ring-white focus:border-white" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Step 3: Schedule Appointment -->
                <div v-if="currentStep === 3" class="grid md:grid-cols-2 gap-8 items-start">
                    <!-- Colonne de gauche -->
                    <div class="space-y-6">
                        <div>
                            <h3 class="uppercase tracking-wide text-2xl text-white font-bold mb-2">Schedule Appointment</h3>
                            <p class="text-white text-sm opacity-90 mb-6">
                                Please select a date and time for your appointment.
                            </p>
                            
                            <div class="relative">
                                <img src="@/assets/images/date.png" alt="Schedule appointment" class="w-80 mx-auto mb-6" />
                            </div>
                        </div>
                    </div>

                    <!-- Colonne de droite -->
                    <div class="space-y-6">
                        <div class="grid grid-cols-1 gap-6">
                            <div class="form-group">
                                <label class="block text-white text-lg font-medium mb-2">Select Date</label>
                                <DatePicker
                                    v-model="appointmentDate"
                                    class="w-full border-2 border-white bg-transparent rounded-lg shadow-sm"
                                />
                            </div>

                            <div class="form-group">
                                <label class="block text-white text-lg font-medium mb-2">Select Time</label>
                                <input type="time" 
                                    v-model="appointmentTime"
                                    class="w-full border-2 border-white bg-transparent text-white rounded-lg py-3 px-4 focus:ring-2 focus:ring-white focus:border-white" />
                            </div>

                            <div class="form-group">
                                <label class="block text-white text-lg font-medium mb-2">Add a Note</label>
                                <textarea 
                                    v-model="appointmentNote" 
                                    placeholder="Add any notes here"
                                    rows="4"
                                    class="w-full border-2 border-white bg-transparent text-white rounded-lg py-3 px-4 focus:ring-2 focus:ring-white focus:border-white"
                                ></textarea>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Step 4: Appointment Confirmation -->
                <div v-if="currentStep === 4" class="grid md:grid-cols-2 gap-8 items-start">
                    <!-- Colonne de gauche -->
                    <div class="space-y-6">
                        <div>
                            <h3 class="uppercase tracking-wide text-2xl text-white font-bold mb-2">Appointment Confirmation</h3>
                            <p class="text-white text-sm opacity-90 mb-6">
                                Please review your appointment details.
                            </p>
                            
                            <div class="relative">
                                <img src="@/assets/images/reminder.png" alt="Appointment reminder" class="w-80 mx-auto mb-6" />
                            </div>
                        </div>
                    </div>

                    <!-- Colonne de droite -->
                    <div class="space-y-6">
                        <div class="p-6 bg-white bg-opacity-10 rounded-lg border-2 border-white">
                            <h4 class="text-white font-semibold text-xl mb-4">Appointment Details</h4>
                            <div class="space-y-4">
                                <p class="text-white">
                                    Your appointment is confirmed for <span class="font-semibold">{{ appointmentDate }}</span> at <span class="font-semibold">{{ appointmentTime }}</span>.
                                </p>
                                <p class="text-white">
                                    Please ensure your availability for this time slot.
                                </p>
                                <div class="mt-6 p-4 bg-white bg-opacity-10 rounded-lg">
                                    <p class="text-white text-sm">
                                        <span class="font-semibold">Important:</span> If you need to reschedule, please inform us 24 hours in advance to avoid a rescheduling fee.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Step 5: Summary -->
                <div v-if="currentStep === 5" class="grid md:grid-cols-2 gap-8 items-start">
                    <!-- Colonne de gauche -->
                    <div class="space-y-6">
                        <div>
                            <h3 class="uppercase tracking-wide text-2xl text-white font-bold mb-2">Summary</h3>
                            <p class="text-white text-sm opacity-90 mb-6">
                                Please review all your information before submission.
                            </p>
                            
                            <div class="relative">
                                <img src="@/assets/images/summary.png" alt="Summary" class="w-80 mx-auto mb-6" />
                            </div>
                        </div>
                    </div>

                    <!-- Colonne de droite -->
                    <div class="space-y-6">
                        <div class="p-6 bg-white bg-opacity-10 rounded-lg border-2 border-white">
                            <h4 class="text-white font-semibold text-xl mb-4">Inspection Details</h4>
                            <div class="space-y-4">
                                <ul class="text-white space-y-3">
                                    <li class="flex items-start space-x-2">
                                        <span class="font-semibold min-w-[120px]">Identity:</span>
                                        <span>{{ formData.who }}</span>
                                    </li>
                                    <li class="flex items-start space-x-2">
                                        <span class="font-semibold min-w-[120px]">Estate Name:</span>
                                        <span>{{ formData.estate_name }}</span>
                                    </li>
                                    <li class="flex items-start space-x-2">
                                        <span class="font-semibold min-w-[120px]">Location:</span>
                                        <span>{{ formData.location }}</span>
                                    </li>
                                    <li class="flex items-start space-x-2">
                                        <span class="font-semibold min-w-[120px]">Price:</span>
                                        <span>{{ formData.price }}</span>
                                    </li>
                                    <li v-if="formData.has_description" class="flex items-start space-x-2">
                                        <span class="font-semibold min-w-[120px]">Description:</span>
                                        <span>{{ formData.description }}</span>
                                    </li>
                                    <li class="flex items-start space-x-2">
                                        <span class="font-semibold min-w-[120px]">Floors:</span>
                                        <span>{{ numFloors }}</span>
                                    </li>
                                    <li class="flex items-start space-x-2">
                                        <span class="font-semibold min-w-[120px]">Date:</span>
                                        <span>{{ appointmentDate }}</span>
                                    </li>
                                    <li class="flex items-start space-x-2">
                                        <span class="font-semibold min-w-[120px]">Time:</span>
                                        <span>{{ appointmentTime }}</span>
                                    </li>
                                    <li v-if="appointmentNote" class="flex items-start space-x-2">
                                        <span class="font-semibold min-w-[120px]">Notes:</span>
                                        <span>{{ appointmentNote }}</span>
                                    </li>
                    </ul>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Step 6: Confirmation -->
                <div v-if="currentStep === 6" class="grid md:grid-cols-2 gap-8 items-start">
                    <!-- Colonne de gauche -->
                    <div class="space-y-6">
                        <div>
                            <h3 class="uppercase tracking-wide text-2xl text-white font-bold mb-2">Submission Confirmed</h3>
                            <p class="text-white text-sm opacity-90 mb-6">
                                Your inspection request has been successfully submitted.
                            </p>
                            
                            <div class="relative">
                                <img src="@/assets/images/submitted.png" alt="Submission confirmed" class="w-80 mx-auto mb-6" />
                            </div>
                        </div>
                    </div>

                    <!-- Colonne de droite -->
                    <div class="space-y-6">
                        <div class="p-6 bg-white bg-opacity-10 rounded-lg border-2 border-white">
                            <h4 class="text-white font-semibold text-xl mb-4">Next Steps</h4>
                            <div class="space-y-4">
                                <p class="text-white">
                                    Thank you for submitting your property inspection request. Our administrator will review your submission and contact you shortly.
                                </p>
                                <div class="mt-6 p-4 bg-white bg-opacity-10 rounded-lg">
                                    <p class="text-white text-sm">
                                        <span class="font-semibold">Important:</span> Please keep your appointment details handy. You will receive a confirmation email with all the information.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Navigation Buttons -->
                <div class="flex justify-end space-x-4 mt-8">
                    <button v-if="currentStep > 1 && currentStep !== 6" @click="prevStep"
                        class="bg-white text-[#6C63FF] py-2 px-6 rounded-lg shadow hover:bg-opacity-90 font-medium">
                        Back
                    </button>
                    <button v-if="currentStep < totalSteps && currentStep !== 5" @click="nextStep"
                        class="bg-white text-[#6C63FF] py-2 px-6 rounded-lg shadow hover:bg-opacity-90 font-medium">
                        Next
                    </button>
                    <button v-if="currentStep === 5" @click="submitForm"
                        class="bg-white text-[#6C63FF] py-2 px-6 rounded-lg shadow hover:bg-opacity-90 font-medium">
                        Submit
                    </button>
                </div>
            </div>
        </div>
    </section>
</template>

<style>
.form-section {
    width: 90%;
    max-width: 1200px;
    margin: 0 auto;
}

.form-container {
    background-color: #6C63FF;
    min-height: 600px;
    position: relative;
}

.stepper-container {
    height: 100%;
    padding: 2rem;
}

/* Animation de transition */
.fade-enter-active, .fade-leave-active {
    transition: opacity 0.5s ease;
}

.fade-enter-from, .fade-leave-to {
    opacity: 0;
}

/* Style des inputs */
input::placeholder, textarea::placeholder {
    color: rgba(255, 255, 255, 0.6);
}

input:-webkit-autofill,
input:-webkit-autofill:hover,
input:-webkit-autofill:focus,
input:-webkit-autofill:active {
    -webkit-box-shadow: 0 0 0 30px #6C63FF inset !important;
    -webkit-text-fill-color: white !important;
}

/* Style du select */
select option {
    background-color: white;
    color: #6C63FF;
}

/* Style du checkbox */
input[type="checkbox"] {
    accent-color: white;
}

::-webkit-scrollbar {
    width: 8px;
}

::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 4px;
}

::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.5);
    border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.7);
}

/* Style des images */
.relative img {
    border-radius: 0.75rem; /* équivalent à rounded-xl */
}
</style>
