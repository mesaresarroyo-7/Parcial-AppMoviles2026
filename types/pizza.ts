// Tipo de dato para representar una pizza en la app
export interface Pizza {
  id?: string;
  nombre: string;
  descripcion: string;
  precio: string;
  stock: string;
  tamano: string;
  ingredientes: string;
  imagenUrl: string;
  categoria: string;
}
