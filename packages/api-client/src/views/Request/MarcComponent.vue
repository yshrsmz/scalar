<script setup lang="ts">
import ViewLayoutSection from '@/components/ViewLayout/ViewLayoutSection.vue'
import { ScalarIcon } from '@scalar/components'

console.log('hello')
</script>
<template>
  <ViewLayoutSection>
    <template #title>
      <ScalarIcon
        class="text-c-3 mr-2.5 !!stroke-2"
        icon="ExternalLink"
        size="md" />
      <div class="flex-1">
        Request
        <span class="text-c-3 pl-1">{{ activeRequest?.summary }}</span>
      </div>
    </template>
    <div class="flex m-auto key-commands">
      <pre
        class="font-code text-[4px] leading-[5px] text-c-3 pre-command relative">
          .:=+++++=================-
         .--#*                       :.
        .-:-**                        -.
      .:-::-+*                        =:
     .:-:::-=#                         ::
    .-:::----**                        ..
   .-:::::---=#                         ..
  :-::::::----**                         ..
.:-::::::::----*=                        ..
.-::::::::------+-                        ..
..::::::::-------=                         ..
 .:::::----------++                        ..
   .:::----------+**+*++*+*++*+++*++++++++++:.
   ------------+*+=-=======================.
   .----------+*+=========================:.
    :--------+*+=-========================.
    .=------+*+=-========================:.
     .=----+*+=-------=================+-.
     .----+*+=----------================.
     .:=-+*+=----------=-==============-
      .-+*+=----------------===========.
       .-+=------------------====-====:.
</pre
      >
      <div class="relative pre-k">
        <pre class="font-code text-[4px] leading-[5px] pre-gradient">
            .:=+++++=================-
           .--#*                       :.
          .-:-**                        -.
        .:-::-+*                        =:
       .:-:::-=#                         ::
      .-:::----**                        ..
     .-:::::---=#                         ..
    :-::::::----**                         ..
  .:-::::::::----*=                        ..
  .-::::::::------+-                        ..
  ..::::::::-------=                         ..
   .:::::----------++                        ..
     .:::----------+**+*++*+*++*+++*++++++++++:.
     ------------+*+=-=======================.
     .----------+*+=========================:.
      :--------+*+=-========================.
      .=------+*+=-========================:.
       .=----+*+=-------=================+-.
       .----+*+=----------================.
       .:=-+*+=----------=-==============-
        .-+*+=----------------===========.
         .-+=------------------====-====:.
  </pre
        >
      </div>
    </div>
    <div class="commandmenu">
      <input
        class="w-full rounded bg-b-2 border-none py-1.5 px-2 mb-2 text-sm"
        placeholder="Search commands..."
        type="text" />
      <div class="text-c-3 font-medium text-xs mt-2">
        Add to Request Sidebar
      </div>
      <div
        class="commandmenu-item text-sm flex items-center py-1.5 px-2 rounded hover:bg-b-2 cursor-pointer">
        <ScalarIcon
          class="text-c-1 mr-2.5 !stroke-1.5"
          icon="ExternalLink"
          size="md" />
        Import Collection
      </div>
      <div
        class="commandmenu-item text-sm flex items-center py-1.5 px-2 rounded hover:bg-b-2 cursor-pointer">
        <ScalarIcon
          class="text-c-1 mr-2.5 !stroke-1.5"
          icon="ExternalLink"
          size="md" />
        Add Request
      </div>
      <div
        class="commandmenu-item text-sm flex items-center py-1.5 px-2 rounded hover:bg-b-2 cursor-pointer">
        <ScalarIcon
          class="text-c-1 mr-2.5 !stroke-1.5"
          icon="ExternalLink"
          size="md" />
        Add Folder
      </div>
      <div
        class="commandmenu-item text-sm flex items-center py-1.5 px-2 rounded hover:bg-b-2 cursor-pointer">
        <ScalarIcon
          class="text-c-1 mr-2.5 !stroke-1.5"
          icon="ExternalLink"
          size="md" />
        Add Collection
      </div>
      <div
        class="commandmenu-item text-sm flex items-center py-1.5 px-2 rounded hover:bg-b-2 cursor-pointer">
        <ScalarIcon
          class="text-c-1 mr-2.5 !stroke-1.5"
          icon="ExternalLink"
          size="md" />
        Add Variant
      </div>
      <div class="text-c-3 font-medium text-xs mt-2">More Actions</div>
      <div
        class="commandmenu-item text-sm flex items-center py-1.5 px-2 rounded hover:bg-b-2 cursor-pointer">
        <ScalarIcon
          class="text-c-1 mr-2.5 !stroke-1.5"
          icon="Brackets"
          size="md" />
        Add Server
      </div>
      <div
        class="commandmenu-item text-sm flex items-center py-1.5 px-2 rounded hover:bg-b-2 cursor-pointer">
        <ScalarIcon
          class="text-c-1 mr-2.5 !stroke-1.5"
          icon="Server"
          size="md" />
        Add Enviornment
      </div>
      <div
        class="commandmenu-item text-sm flex items-center py-1.5 px-2 rounded hover:bg-b-2 cursor-pointer">
        <ScalarIcon
          class="text-c-1 mr-2.5 !stroke-1.5"
          icon="Cookie"
          size="md" />
        Add Cookie
      </div>
    </div>
  </ViewLayoutSection>
</template>
<style scoped>
.pre-gradient {
  background: -webkit-linear-gradient(
    5deg,
    transparent 10%,
    var(--scalar-color-3) 50%
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-left: -25px;
}
.pre-command:after {
  content: '⌘';
  color: var(--scalar-color-1);
  font-size: 20px;
  position: absolute;
  top: 12px;
  right: 25px;
  font-weight: 200;
}
.pre-command:before {
  content: 'command';
  color: var(--scalar-color-1);
  font-size: 12px;
  position: absolute;
  top: 48px;
  right: 12px;
}
.pre-k:after {
  content: 'K';
  color: var(--scalar-color-1);
  font-size: 27px;
  position: absolute;
  top: 22px;
  right: 35px;
  font-weight: 200;
}
.pre-command,
.pre-k {
  transition: all 0.15s ease-in-out;
}
.key-commands:hover .pre-command {
  transform: translate3d(-10px, 25px, 0);
}
.key-commands:hover .pre-k {
  transition-delay: 0.1s;
  transform: translate3d(-10px, 25px, 0);
}
.key-commands {
  top: -50px;
  position: relative;
}

/* command menu */
.commandmenu {
  box-shadow: var(--scalar-shadow-2);
  border-radius: var(--scalar-radius);
  background-color: var(--scalar-background-1);
  width: 100%;
  max-width: 580px;
  padding: 12px;
  margin: 12px;
  position: fixed;
  z-index: 10;
  left: 50%;
  top: 50%;
  transform: translate3d(-50%, -50%, 0);
}
</style>
