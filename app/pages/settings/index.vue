<script setup lang="ts">
import type { FormError, FormSubmitEvent } from "#ui/types";
import axios from "axios";

const fileRef = ref<HTMLInputElement>();
const isDeleteAccountModalOpen = ref(false);
const userId = ref(null);

const state = reactive({
  name: "",
  email: "",
  avatar: "",
  password_current: "",
  password_new: "",
});

const toast = useToast();

// Charger les données de l'utilisateur au montage
onMounted(async () => {
  if (process.client) {
    const storedUserId = localStorage.getItem("userId");
    console.log("Loading user data for userId:", storedUserId);

    if (storedUserId) {
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/api/user/${storedUserId}`
        );
        console.log("User data received:", response.data);

        // Mettre à jour le state avec les données de l'utilisateur
        state.name = response.data.user.name;
        state.email = response.data.user.email;
        state.avatar = response.data.user.avatar || "";
        userId.value = storedUserId;
      } catch (error) {
        console.error("Error loading user data:", error);
        toast.add({
          title: "Error loading user data",
          icon: "i-heroicons-x-circle",
          color: "red",
        });
      }
    }
  }
});

function validate(state: any): FormError[] {
  const errors = [];
  if (!state.name) errors.push({ path: "name", message: "Please enter your name." });
  if (!state.email) errors.push({ path: "email", message: "Please enter your email." });
  return errors;
}

async function onFileChange(e: Event) {
  const input = e.target as HTMLInputElement;
  if (!input.files?.length) return;

  const file = input.files[0];
  const reader = new FileReader();

  reader.onload = (e) => {
    state.avatar = e.target?.result as string;
  };

  reader.readAsDataURL(file);
}

function onFileClick() {
  fileRef.value?.click();
}

async function onSubmit(event: FormSubmitEvent<any>) {
  try {
    const profileData = {
      name: state.name,
      email: state.email,
      avatar: state.avatar,
    };

    await axios.put(
      `http://127.0.0.1:8000/api/edit-profile/${userId.value}`,
      profileData
    );
    toast.add({ title: "Profile updated", icon: "i-heroicons-check-circle" });
  } catch (error) {
    console.error("Error updating profile:", error);
    toast.add({
      title: "Error updating profile",
      icon: "i-heroicons-x-circle",
      color: "red",
    });
  }
}

async function handleResetPassword() {
  try {
    const passwordData = {
      current_password: state.password_current,
      new_password: state.password_new,
    };

    await axios.put(
      `http://127.0.0.1:8000/api/reset-password/${userId.value}`,
      passwordData
    );
    state.password_current = "";
    state.password_new = "";
    toast.add({ title: "Password updated", icon: "i-heroicons-check-circle" });
  } catch (error) {
    toast.add({
      title: "Error updating password",
      icon: "i-heroicons-x-circle",
      color: "red",
    });
  }
}
</script>

<template>
  <UDashboardPanelContent class="pb-24">
    <UDashboardSection
      title="Theme"
      description="Customize the look and feel of your dashboard."
    >
      <template #links>
        <UColorModeSelect color="gray" />
      </template>
    </UDashboardSection>

    <UDivider class="mb-4" />

    <!-- Section Profile -->
    <UForm
      :state="state"
      :validate="validate"
      :validate-on="['submit']"
      @submit="onSubmit"
    >
      <UDashboardSection
        title="Profile"
        description="This information will be displayed publicly so be careful what you share."
      >
        <template #links>
          <UButton type="submit" label="Save changes" color="black" />
        </template>

        <UFormGroup
          name="name"
          label="Name"
          description="Will appear on receipts, invoices, and other communication."
          required
          class="grid grid-cols-2 gap-2 items-center"
          :ui="{ container: '' }"
        >
          <UInput
            v-model="state.name"
            autocomplete="off"
            icon="i-heroicons-user"
            size="md"
          />
        </UFormGroup>

        <UFormGroup
          name="email"
          label="Email"
          description="Used to sign in, for email receipts and product updates."
          required
          class="grid grid-cols-2 gap-2"
          :ui="{ container: '' }"
        >
          <UInput
            v-model="state.email"
            type="email"
            autocomplete="off"
            icon="i-heroicons-envelope"
            size="md"
          />
        </UFormGroup>

        <UFormGroup
          name="avatar"
          label="Avatar"
          class="grid grid-cols-2 gap-2"
          help="JPG, GIF or PNG. 1MB Max."
          :ui="{ container: 'flex flex-wrap items-center gap-3', help: 'mt-0' }"
        >
          <UAvatar
            :src="state.avatar ? `http://127.0.0.1:8000/storage/${state.avatar}` : null"
            :alt="state.name"
            size="lg"
          />
          <UButton label="Choose" color="white" size="md" @click="onFileClick" />

          <input
            ref="fileRef"
            type="file"
            class="hidden"
            accept=".jpg, .jpeg, .png, .gif"
            @change="onFileChange"
          />
        </UFormGroup>
      </UDashboardSection>
    </UForm>

    <UDivider class="my-6" />

    <!-- Section Reset Password -->
    <UDashboardSection
      title="Reset Password"
      description="Update your password here. You'll need your current password to make this change."
    >
      <template #links>
        <UButton label="Reset Password" color="black" @click="handleResetPassword" />
      </template>

      <UFormGroup name="password" class="grid grid-cols-2 gap-2" :ui="{ container: '' }">
        <UInput
          v-model="state.password_current"
          type="password"
          placeholder="Current password"
          size="md"
        />
        <UInput
          v-model="state.password_new"
          type="password"
          placeholder="New password"
          size="md"
          class="mt-2"
        />
      </UFormGroup>
    </UDashboardSection>

    <UDivider class="my-6" />

    <!-- Section Delete Account -->
    <UDashboardSection
      title="Account"
      description="No longer want to use our service? You can delete your account here. This action is not reversible. All information related to this account will be deleted permanently."
    >
      <div>
        <UButton
          disabled
          color="red"
          label="Delete account"
          size="md"
          @click="isDeleteAccountModalOpen = true"
        />
      </div>
    </UDashboardSection>

    <SettingsDeleteAccountModal v-model="isDeleteAccountModalOpen" />
  </UDashboardPanelContent>
</template>
