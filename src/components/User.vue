<template>
    <v-container fluid class="pa-0 my-2">
        <v-layout row wrap>
            <PageTitle text="Mis Logros"></PageTitle>

            <v-flex xs12 md4 order-md1 order-xs2 :class="{'px-1': $vuetify.breakpoint.smAndDown, 'px-4' : $vuetify.breakpoint.mdAndUp, }">
                <v-expansion-panel class="dense-expansion">
                    <v-expansion-panel-content  v-for="communidad in communidads" :key="communidad.id">
                        <div slot="header" class="subheading primary--text py-0"><strong>{{communidad.nombre}}</strong></div>
                            <div v-for="provincia in provinceGroup(communidad.id)":key="provincia.id">
                                <v-layout class="mb-1">
                                    <v-flex xs4 offset-xs1 class="primary--text">{{provincia.nombre}}</v-flex>
                                    <v-flex xs3 class="primary--text">
                                        <strong>{{provincia.completed}} | {{provincia.total}}</strong>
                                    </v-flex>
                                    <v-flex xs2 class="primary--text" v-if="provincia.completed === provincia.total" >
                                        <v-icon color="yellow">star</v-icon>
                                    </v-flex>
                                    <v-flex xs2 class="primary--text">
                                        <v-btn fab dark small color="primary" class="xxxs-icon"
                                        @click="$router.push({name: 'user-provincia', params: {pid: provincia.id}});"
                                        ><img src="@/assets/icons/logowhite.png" height="14px" width="14px">
                                        </v-btn>
                                    </v-flex>
                                </v-layout>
                            </div>
                    </v-expansion-panel-content>
                </v-expansion-panel>
            </v-flex>
            <v-flex xs12 md8 order-md2 order-xs1 :class="{'px-1': $vuetify.breakpoint.smAndDown, 'px-4' : $vuetify.breakpoint.mdAndUp, }">
                <SpainSVG :options="options"></SpainSVG>
            </v-flex>
        </v-layout>
    </v-container>
</template>


<script>

    import SpainSVG from './SVG/SpainSVG'
    import provinceMap from './SVG/provinceMap'
    import _ from 'lodash'

    export default {
        props: ["userLogros"],
        data: function() {
            return {
                options: null,
            };
        },

        components: {
            'SpainSVG' : SpainSVG
        },

        watch: {
            '$route.query': function (route) {
                this.createData()
                this.createMapData()
            }
        },

        beforeMount () {
            this.createData()
            this.createMapData()
        },

        methods: {

            provinceGroup (commId) {
                return this.provincias.filter(x => x.communidad_id === commId)
            },

            createData () {
                this.cimero = this.$route.params.cimero.cimero
                this.logros = this.$route.params.cimero.logros
                this.provincias = this.$route.params.cimero.provincias
                this.communidads = this.$route.params.cimero.communidads
                this.cimas = this.$route.params.cimas
            },

        
            createMapData () {
                var that = this;
                var logros = _.groupBy(this.logros,"provincia_id")
                this.provincias = this.provincias.map(x => {
                    x.total = x.active_cimas_count;
                    //x.completed = that.logros[x.id.toString()] ? that.logros[x.id.toString()].length : 0 ;
                    x.completed = logros[x.id.toString()] ? logros[x.id.toString()].length : 0 ;
                    x.value = x.completed / x.total;
                    return x;
                })

                this.options = {
                    plotOptions: provinceMap.plotOptions,
                    tooltip: {
                        enabled: false,
                    },
                    credits: {
                        enabled: false,
                    },
                    title: false,
                    series: [{
                        type: 'map',
                        joinBy: ['id'],
                        data: that.provincias,
                        mapData: provinceMap.map.data,


                    }],
                    colorAxis: {
                        min: 0,
                        max: 1,
                        showInLegend: false,
                        type: 'linear',
                        minColor: '#f5eee7',
                        maxColor: '#030f24',
                    },
                }
            }
        }
    }
</script>
