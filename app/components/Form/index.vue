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
        <div class="form-container rounded-xl shadow-md overflow-hidden" style="height: 600px; overflow-y: auto;">
            <div class="p-8 stepper-container" style="height: 600px; position: relative;">
                <!-- Stepper Indicator -->
                <div class="flex justify-between items-center mb-6">
                    <div class="text-white font-semibold">
                        Step {{ currentStep }} of {{ totalSteps }}
                    </div>
                    <div class="flex space-x-2">
                        <div v-for="step in totalSteps" :key="step" class="w-8 h-2 rounded-full"
                            :class="step <= currentStep ? 'bg-white' : 'bg-gray-400'"></div>
                    </div>
                </div>

                <!-- Step Content -->
                <div v-if="currentStep === 1">
                    <h3 class="uppercase tracking-wide text-sm text-white font-semibold">Step 1: Identify Yourself</h3>
                    <p class="mt-2 text-white text-sm">
                        Please select who is requesting the property inspection.
                    </p>
                    <div class="mt-4 space-y-4">
                        <div>
                            <label class="block text-white text-sm font-medium">Who are you?</label>
                            <select v-model="formData.who"
                                class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                                <option value="" disabled>Select an option</option>
                                <option value="particulier">Particulier</option>
                                <option value="agence">Agence</option>
                                <option value="investisseur">Investisseur</option>
                            </select>
                        </div>

                        <!-- Champs additionnels qui apparaissent après la sélection -->
                        <div v-if="formData.who" class="space-y-4">
                            <div>
                                <label class="block text-white text-sm font-medium">Estate Name</label>
                                <input type="text" v-model="formData.estate_name"
                                    class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    placeholder="Enter estate name" />
                            </div>

                            <div>
                                <label class="block text-white text-sm font-medium">Location</label>
                                <input type="text" v-model="formData.location"
                                    class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    placeholder="Enter address" />
                            </div>

                            <div>
                                <label class="block text-white text-sm font-medium">Price</label>
                                <input type="number" v-model="formData.price"
                                    class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    placeholder="Enter price" />
                            </div>

                            <div>
                                <div class="flex items-center">
                                    <input type="checkbox" v-model="formData.has_description" class="mr-2" />
                                    <label class="text-white text-sm font-medium">Add Description</label>
                                </div>
                                <textarea v-if="formData.has_description" v-model="formData.description"
                                    class="mt-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    placeholder="Enter description" rows="3"></textarea>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Step 2: Configuration des étages -->
                <div v-if="currentStep === 2">
                    <h3 class="uppercase tracking-wide text-sm text-white font-semibold">Step 2: Floor Configuration</h3>
                    
                    <!-- Sélection du nombre d'étages -->
                    <div class="mt-4">
                        <label class="block text-white text-sm font-medium">Number of Floors</label>
                        <input type="number" v-model.number="numFloors" min="1"
                            class="mt-1 block w-32 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                    </div>

                    <!-- Configuration pour chaque étage -->
                    <div v-if="numFloors > 0" class="mt-6 space-y-6">
                        <div v-for="(floor, floorIndex) in floorsConfig" :key="floorIndex"
                            class="p-4 bg-white bg-opacity-10 rounded-lg">
                            <h4 class="text-white font-semibold mb-4">{{ floor.label }}</h4>

                            <!-- Sections de pièces -->
                            <div class="grid grid-cols-2 gap-4">
                                <!-- Main Rooms -->
                                <div>
                                    <h5 class="text-white font-medium mb-2">Main Rooms</h5>
                                    <div v-for="room in roomTypes.mainRooms" :key="room" class="flex items-center space-x-2 mb-2">
                                        <input type="checkbox" :checked="floor.rooms[room] !== undefined"
                                            @change="toggleRoom(floorIndex, room)" />
                                        <span class="text-white">{{ room }}</span>
                                        <input v-if="floor.rooms[room] !== undefined" type="number" 
                                            v-model="floor.rooms[room]" min="1"
                                            class="w-20 border border-gray-300 rounded-md shadow-sm" />
                                    </div>
                                </div>

                                <!-- Technical Rooms -->
                                <div>
                                    <h5 class="text-white font-medium mb-2">Technical Rooms</h5>
                                    <div v-for="room in roomTypes.technicalRooms" :key="room" class="flex items-center space-x-2 mb-2">
                                        <input type="checkbox" :checked="floor.rooms[room] !== undefined"
                                            @change="toggleRoom(floorIndex, room)" />
                                        <span class="text-white">{{ room }}</span>
                                        <input v-if="floor.rooms[room] !== undefined" type="number" 
                                            v-model="floor.rooms[room]" min="1"
                                            class="w-20 border border-gray-300 rounded-md shadow-sm" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Step 3: Schedule Appointment -->
                <div v-if="currentStep === 3">
                    <h3 class="uppercase tracking-wide text-sm text-white font-semibold">Step 3: Schedule Appointment</h3>
                    <p class="mt-2 text-white text-sm">
                        Please select a date and time for your appointment and add any notes.
                    </p>
                    <div class="mt-4 space-y-4">
                        <div>
                            <label class="block text-white text-sm font-medium">Select Date</label>
                            <DatePicker
                                v-model="appointmentDate"
                                class="mt-1 block w-full"
                            />
                        </div>
                        <label class="block text-white text-sm font-medium">Select Time</label>
                        <input type="time" v-model="appointmentTime"
                            class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                        <label class="block text-white text-sm font-medium">Add a Note</label>
                        <textarea v-model="appointmentNote" placeholder="Add any notes here"
                            class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"></textarea>
                    </div>
                </div>

                <!-- Step 4: Appointment Confirmation -->
                <div v-if="currentStep === 4">
                    <h3 class="uppercase tracking-wide text-sm text-white font-semibold">Step 4: Appointment Confirmation</h3>
                    <p class="mt-2 text-white text-sm">
                        Your appointment is confirmed for {{ appointmentDate }} at {{ appointmentTime }}. Please ensure your availability.
                    </p>
                    <p class="mt-4 text-white text-sm">
                        If you need to reschedule, inform us 24 hours in advance to avoid a rescheduling fee.
                    </p>
                    <p class="mt-4 text-white text-sm">
                        We appreciate your cooperation and look forward to serving you!
                    </p>
                </div>

                <!-- Step 5: Summary -->
                <div v-if="currentStep === 5">
                    <h3 class="uppercase tracking-wide text-sm text-white font-semibold">Step 5: Summary</h3>
                    <p class="mt-2 text-white text-sm">
                        Here is a summary of your selections:
                    </p>
                    <ul class="mt-4 text-white text-sm list-disc list-inside space-y-2">
                        <li><strong>Identity:</strong> {{ formData.who }}</li>
                        <li><strong>Estate Name:</strong> {{ formData.estate_name }}</li>
                        <li><strong>Location:</strong> {{ formData.location }}</li>
                        <li><strong>Price:</strong> {{ formData.price }}</li>
                        <li v-if="formData.has_description"><strong>Description:</strong> {{ formData.description }}</li>
                        <li><strong>Number of Floors:</strong> {{ numFloors }}</li>
                        <li v-for="(floor, index) in floorsConfig" :key="index">
                            <strong>{{ floor.label }}:</strong>
                            <ul class="ml-4 mt-1">
                                <li v-for="(quantity, room) in floor.rooms" :key="room">
                                    {{ room }}: {{ quantity }}
                                </li>
                            </ul>
                        </li>
                        <li><strong>Appointment Date:</strong> {{ appointmentDate }}</li>
                        <li><strong>Appointment Time:</strong> {{ appointmentTime }}</li>
                        <li v-if="appointmentNote"><strong>Notes:</strong> {{ appointmentNote }}</li>
                    </ul>
                </div>

                <!-- Step 6: Confirmation -->
                <div v-if="currentStep === 6">
                    <h3 class="uppercase tracking-wide text-sm text-white font-semibold">Step 6: Confirmation</h3>
                    <p class="mt-2 text-white text-sm">
                        Your submission has been confirmed. Please wait for a response from the administrator to proceed with the next steps.
                    </p>
                    <p class="mt-4 text-white text-sm">
                        Thank you for your patience and cooperation.
                    </p>
                </div>

                <!-- Navigation Buttons -->
                <div class="flex justify-end space-x-4 mt-6 absolute bottom-0 right-0 p-8">
                    <button v-if="currentStep > 1" @click="prevStep"
                        class="bg-gray-500 text-white py-2 px-4 rounded-md shadow hover:bg-gray-600">
                        Back
                    </button>
                    <button v-if="currentStep < totalSteps" @click="nextStep"
                        class="bg-indigo-500 text-white py-2 px-4 rounded-md shadow hover:bg-indigo-600">
                        Next
                    </button>
                    <button v-if="currentStep === 5" @click="submitForm"
                        class="bg-green-500 text-white py-2 px-4 rounded-md shadow hover:bg-green-600">
                        Submit
                    </button>
                </div>
            </div>
        </div>
    </section>
</template>

<style>
.form-section {
    width: 80%;
    margin: 0 auto;
}

.form-container {
    background-color: #F1A501;
    height: 600px;
    overflow-y: auto;
    padding-left: 80px;
    padding-right: 80px;
    padding-top: 0;
    padding-bottom: 0;
}
</style>
