<template>
    <div class="coffeeTimePanel">
        <div class="header">
            Coffee Time
        </div>

        <div class="body">
            {{message}}
        </div>
    </div>
</template>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
    .coffeeTimePanel {
        border: 1px solid #000000;
        margin: auto;
        width: 25%;

        .header {
            text-align: left;
            padding: 5px;
            background-color: #d3d3d3;
            font-weight: bold;
        }

        .body {
            text-align: left;
            padding: 10px 5px;
        }
    }
</style>

<script>
export default {
    name: 'CoffeeTimePanel',
    props: ['message']
};
</script>

