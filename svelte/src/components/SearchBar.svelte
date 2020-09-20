<script lang="ts">
  export let onsubmit: (formData: typeof formData) => void
  let formData = {
    searchTerm: '',
  }
</script>

<form on:submit|preventDefault={onsubmit(formData)}>
  <label>
    <input placeholder="Search" type="text" bind:value={formData.searchTerm} />
  </label>
</form>
