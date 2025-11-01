<script lang="ts">
  interface Props {
    class?: string;
  }

  let { class: className = '' }: Props = $props();
</script>

<footer class="flex h-16 items-center justify-between {className}">
  <div class="w-full text-center text-xs leading-loose text-muted-foreground">
    <div>
      Built by <a
        href="https://github.com/azais-corentin"
        class="font-medium underline underline-offset-4"
      >Corentin Azais</a>
    </div>
    <div>
      commit <a
        href="https://github.com/azais-corentin/cofund/commit/{GIT_COMMIT}"
        class="font-medium underline underline-offset-4"
      >{GIT_COMMIT}</a>
    </div>
  </div>
</footer>
