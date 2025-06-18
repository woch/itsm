<template>
  <div class="form-container">
    <h1>Registrar Activo</h1>
    <form @submit.prevent="guardarActivo">
      <div>
        <label for="nombre">Nombre del Activo:</label>
        <input v-model="activo.nombre" type="text" id="nombre" required />
      </div>
      <div>
        <label for="tipo">Tipo de Activo:</label>
        <select v-model="activo.tipo" required>
          <option value="licencia">Licencia</option>
          <option value="hardware">Hardware</option>
          <option value="software">Software</option>
        </select>
      </div>
      <div>
        <label for="marca">Marca:</label>
        <input v-model="activo.marca" type="text" id="marca" required />
      </div>
      <div>
        <label for="modelo">Modelo:</label>
        <input v-model="activo.modelo" type="text" id="modelo" required />
      </div>
      <div>
        <label for="numeroSerie">Número de Serie:</label>
        <input v-model="activo.numeroSerie" type="text" id="numeroSerie" required />
      </div>
      <div>
        <label for="descripcion">Descripción:</label>
        <input v-model="activo.descripcion" type="text" id="descripcion" required />
      </div>
      <div>
        <label for="departamento">Departamento Asignado:</label>
        <input v-model="activo.departamentoAsignado" type="text" id="departamento" required />
      </div>
      <div>
        <label for="valor">Valor:</label>
        <input v-model="activo.valor" type="number" id="valor" required />
      </div>
      <button type="submit">Guardar Activo</button>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activo: {
        nombre: "",
        tipo: "licencia",
        marca: "",
        modelo: "",
        numeroSerie: "",
        descripcion: "",
        departamentoAsignado: "",
        valor: ""
      }
    };
  },
  methods: {
    async guardarActivo() {
      try {
        const response = await fetch("http://localhost:3001/api/activos/registrar", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(this.activo)
        });

        if (response.ok) {
          alert("Activo registrado con éxito.");
        } else {
          alert("Error al registrar el activo.");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    }
  }
};
</script>

<style scoped>
/* Estilos del formulario */
.form-container {
  max-width: 600px;
  margin: auto;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
}
</style>