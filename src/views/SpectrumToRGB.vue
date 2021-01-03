<template>
  <app-layout>
    <div class="container mt-2">
      <div class="card">
        <div class="card-body">
          <div class="row">
            <div class="col-md-12">
              <h4>Acknowledgment</h4>
              <p>Spectra from Min Chen, University of Sydney</p>
            </div>
          </div>
          <div class="row">
            <div class="col-md-8">
              <div ref="colorSample" class="color-sample text-center" :style="'background-color: ' + this.rgb">{{ this.rgb }}</div>
            </div>
            <div class="col-md-4">
              <div :key="'spectrum-'+index"  v-for="(spectrum, index) in spectra">
                <input type="radio" 
                  v-model="selectedSpectrum"
                  :value="index" 
                  autocomplete="off"
                  @change="computeRGB"
                >
                {{ spectrum.name }}
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-md-12">
              <h3>Spectrum</h3>
              <table class="table table-hover">
                <thead>
                  <tr>
                    <th>Wavelength(nm)</th>
                    <th>Absorbance</th>
                  </tr>
                </thead>
                <tbody>
                  <tr :key="'reading-'+index" v-for="(spectrumReading, index) in spectra[selectedSpectrum].spectrum.data">
                    <td>
                      {{ spectrumReading[0] }}
                    </td>
                    <td>
                      {{ spectrumReading[1] }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </app-layout>
</template>
<style scoped>
.color-sample {
  height: 300px;
  line-height: 300px;
  font-size: 40px;
}
</style>
<script>
import AppLayout from "@/layouts/AppLayout";
import {Spectrum, Converter} from "spectrum-to-rgb";
import spectraData from "@/config/spectra";
export default {
  name: 'SpectrumToRGB',
  components: { AppLayout },
  data() {
    return {
      selectedSpectrum: 0,
      spectra: spectraData.map((spectrum) => ({
        name: spectrum.name,
        spectrum: new Spectrum(spectrum.spectrum, spectrum.isReflectance)
      })), 
      memoizedRGB: new Array(spectraData.length),
      rgb: null
    }
  },
  methods: {
    computeRGB: function() {
      if(this.memoizedRGB[this.selectedSpectrum]) {
        this.rgb = this.memoizedRGB[this.selectedSpectrum];
      } else {
        const converter = new Converter();
        const color = converter.convert(this.spectra[this.selectedSpectrum].spectrum);
        this.rgb = "rgb(" + color.getRed() +"," + color.getGreen() + "," + color.getBlue() + ")";
        this.memoizedRGB[this.selectedSpectrum] = this.rgb;
      }
      
    }
  },
  mounted() {
    this.computeRGB();
  },
}
</script>