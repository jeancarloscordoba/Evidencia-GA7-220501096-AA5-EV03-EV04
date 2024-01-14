const express = require('express');
const mysql = require('mysql');

const app = express();
const port = 3000;

// Configuración de la conexión a la base de datos MySQL
const db = mysql.createConnection({
  host: 'localhost',
  port: 33065, //El puerto debe cambiarse si se tien uno diferente. 
  user: 'root', // Tu nombre de usuario de MySQL
  password: '', // Tu contraseña de MySQL
  database: 'bd_ventas'
});

// Conectar a la base de datos
db.connect(err => {
  if (err) {
    console.error('Error al conectar a la base de datos: ' + err.message);
  } else {
    console.log('Conexión exitosa a la base de datos');
  }
});

// Middleware para permitir solicitudes con cuerpo JSON
app.use(express.json());

// Rutas CRUD para productos
// Crear un nuevo producto
app.post('/registrar-producto', (req, res) => {
  const nuevoProducto = req.body;
  db.query('INSERT INTO producto SET ?', nuevoProducto, (err, result) => {
    if (err) {
      console.error('Error al insertar un nuevo producto: ' + err.message);
      res.status(500).send('Error interno del servidor');
    } else {
      res.status(201).send('Producto creado con éxito');
    }
  });
});

app.get('/productos', (req, res) => {
  // Obtener todos los productos
  db.query('SELECT * FROM producto', (err, results) => {
    if (err) {
      console.error('Error al obtener productos: ' + err.message);
      res.status(500).send('Error interno del servidor');
    } else {
      res.status(200).json(results);
    }
  });
});

app.get('/productos/:id', (req, res) => {
  // Obtener un producto por ID
  const productId = req.params.id;
  db.query('SELECT * FROM producto WHERE IdProducto = ?', productId, (err, results) => {
    if (err) {
      console.error('Error al obtener el producto: ' + err.message);
      res.status(500).send('Error interno del servidor');
    } else if (results.length === 0) {
      res.status(404).send('Producto no encontrado');
    } else {
      res.status(200).json(results[0]);
    }
  });
});

app.put('/editar-producto/:id', (req, res) => {
  // Actualizar un producto por ID
  const productId = req.params.id;
  const updatedProduct = req.body;
  db.query('UPDATE producto SET ? WHERE IdProducto = ?', [updatedProduct, productId], (err, result) => {
    if (err) {
      console.error('Error al actualizar el producto: ' + err.message);
      res.status(500).send('Error interno del servidor');
    } else if (result.affectedRows === 0) {
      res.status(404).send('Producto no encontrado');
    } else {
      res.status(200).send('Producto actualizado con éxito');
    }
  });
});

app.delete('/eliminar-producto/:id', (req, res) => {
  // Eliminar un producto por ID
  const productId = req.params.id;
  db.query('DELETE FROM producto WHERE IdProducto = ?', productId, (err, result) => {
    if (err) {
      console.error('Error al eliminar el producto: ' + err.message);
      res.status(500).send('Error interno del servidor');
    } else if (result.affectedRows === 0) {
      res.status(404).send('Producto no encontrado');
    } else {
      res.status(200).send('Producto eliminado con éxito');
    }
  });
});


// Rutas para CRUD de empleados

// Obtener todos los empleados
app.get('/empleados', (req, res) => {
    db.query('SELECT * FROM empleado', (err, result) => {
      if (err) {
        throw err;
      }
      res.json(result);
    });
});

// Obtener un empleado por DNI
app.get('/empleados/:id', (req, res) => {
    const idEmpleado = req.params.id;
    db.query('SELECT * FROM empleado WHERE Dni = ?', [idEmpleado], (err, result) => {
        if (err) {
        throw err;
        }
        res.json(result[0]);
    });
});

// login del empleado
app.post('/login-empleado/', (req, res) => {
  const user = req.body.user;
  const password = req.body.password;
  
  db.query('SELECT * FROM empleado WHERE User = ?', [user], (err, result) => {
      if (err) {
        res.status(500).send('Error interno del servidor');
      } else {
        if (result.length > 0) {
          const empleado = result[0];
          if (empleado.Dni === password) {
            res.status(200).send('Inicio de sesión exitoso');
          } else {
            res.status(401).send('Contraseña incorrecta');
          }
        } else {
          res.status(404).send('Empleado no encontrado');
        }
      }
  });
});

// Agregar un nuevo empleado
app.post('/registrar-empleado', (req, res) => {
    const nuevoEmpleado = req.body;
    db.query('INSERT INTO empleado SET ?', nuevoEmpleado, (err, result) => {
        if (err) {
        throw err;
        }
        res.send('Empleado agregado correctamente');
    });
});

// Actualizar un empleado
app.put('/editar-empleado/:id', (req, res) => {
    const idEmpleado = req.params.id;
    const datosActualizados = req.body;
    db.query('UPDATE empleado SET ? WHERE IdEmpleado = ?', [datosActualizados, idEmpleado], (err, result) => {
        if (err) {
        throw err;
        }
        res.send('Empleado actualizado correctamente');
    });
});

// Eliminar un empleado
app.delete('/eliminar-empleado/:id', (req, res) => {
    const idEmpleado = req.params.id;
    db.query('DELETE FROM empleado WHERE IdEmpleado = ?', [idEmpleado], (err, result) => {
        if (err) {
        throw err;
        }
        res.send('Empleado eliminado correctamente');
    });
});


// Rutas para CRUD clientes

// Obtener todos los clientes
app.get('/clientes', (req, res) => {
    const query = 'SELECT * FROM cliente';
    db.query(query, (err, result) => {
      if (err) {
        console.error('Error al obtener clientes:', err);
        res.status(500).send('Error interno del servidor');
      } else {
        res.json(result);
      }
    });
});
  
// Agregar un nuevo cliente
app.post('/registrar-cliente', (req, res) => {
    const nuevoCliente = req.body;
    const query = 'INSERT INTO cliente SET ?';
    db.query(query, nuevoCliente, (err, result) => {
      if (err) {
        console.error('Error al agregar cliente:', err);
        res.status(500).send('Error interno del servidor');
      } else {
        res.send('Cliente agregado correctamente');
      }
    });
});
  
// Actualizar un cliente por ID
app.put('/editar-cliente/:id', (req, res) => {
    const clienteId = req.params.id;
    const datosActualizados = req.body;
    const query = 'UPDATE cliente SET ? WHERE id = ?';
    db.query(query, [datosActualizados, clienteId], (err, result) => {
      if (err) {
        console.error('Error al actualizar cliente:', err);
        res.status(500).send('Error interno del servidor');
      } else {
        res.json({ mensaje: 'Cliente actualizado correctamente' });
      }
    });
});
  
  // Eliminar un cliente por ID
app.delete('/eliminar-cliente/:id', (req, res) => {
    const clienteId = req.params.id;
    const query = 'DELETE FROM cliente WHERE id = ?';
    db.query(query, clienteId, (err, result) => {
        if (err) {
        console.error('Error al eliminar cliente:', err);
        res.status(500).send('Error interno del servidor');
        } else {
        res.json({ mensaje: 'Cliente eliminado correctamente' });
        }
    });
});

// Buscar cliente por DNI
app.get('/clientes/:dni', (req, res) => {
    const clienteDNI = req.params.dni;
    const query = 'SELECT * FROM cliente WHERE dni = ?';
    db.query(query, clienteDNI, (err, result) => {
      if (err) {
        console.error('Error al buscar cliente por DNI:', err);
        res.status(500).send('Error interno del servidor');
      } else {
        if (result.length > 0) {
          res.json(result[0]);
        } else {
          res.status(404).send('Cliente no encontrado');
        }
      }
    });
});

// agregar producto al carrito
app.post('/carrito-agregar', (req, res) => {
    const productId = req.body.id_producto;
    const cantidadComprar = req.body.cantidad;
  
    // Verificar si el producto existe y tiene suficiente stock
    db.query('SELECT * FROM producto WHERE IdProducto = ?', productId, (err, results) => {
      if (err) {
        console.error('Error al obtener el producto: ' + err.message);
        res.status(500).send('Error interno del servidor');
      } else if (results.length === 0) {
        res.status(404).send('Producto no encontrado');
      } else {
        const producto = results[0];
  
        if (producto.Stock >= cantidadComprar) {
          // Restar la cantidad del stock
          const nuevoStock = producto.Stock - cantidadComprar;
          db.query('UPDATE producto SET Stock = ? WHERE IdProducto = ?', [nuevoStock, productId], (err, result) => {
            if (err) {
              console.error('Error al actualizar el stock del producto: ' + err.message);
              res.status(500).send('Error interno del servidor');
            } else if (result.affectedRows === 0) {
              res.status(404).send('Producto no encontrado');
            } else {
              // Agregar el producto al carrito (puedes almacenar esta información en una base de datos o en memoria)
              const productoEnCarrito = {
                id: productId,
                cantidad: cantidadComprar,
                nombre: producto.Nombres,
                precio: producto.Precio
              };

              res.status(200).send('Producto agregado al carrito con éxito');
            }
          });
        } else {
          res.status(400).send('Stock insuficiente para la cantidad solicitada');
        }
      }
    });
});
  
//eliminar del carrito
app.post('/carrito-eliminar-producto', (req, res) => {
    const productId = req.body.id_producto;
    const cantidadEliminar = req.body.cantidad;
  
    // Recuperar información del producto original
    db.query('SELECT * FROM producto WHERE IdProducto = ?', productId, (err, results) => {
      if (err) {
        console.error('Error al obtener el producto: ' + err.message);
        res.status(500).send('Error interno del servidor');
      } else if (results.length === 0) {
        res.status(404).send('Producto no encontrado');
      } else {
        const producto = results[0];
        // sumar al stock la cantidad que habia en el carrito para que vuelva a la normalidad
        const nuevoStock = producto.Stock + cantidadEliminar;
        // actualizar el stock del producto
        db.query('UPDATE producto SET Stock = ? WHERE IdProducto = ?', [nuevoStock, productId], (err, result) => {
            if (err) {
                console.error('Error al actualizar el stock del producto: ' + err.message);
                res.status(500).send('Error interno del servidor');
            } else if (result.affectedRows === 0) {
                res.status(404).send('Producto no encontrado');
            } else {
                res.status(200).send('Producto eliminado del carrito con éxito');
            }
        });
      }
    });
});


// registrar venta en la bd
app.post('/registrarVenta', async (req, res) => {
    const { idCliente, idEmpleado, productos } = req.body;

    var totaMonto = 0;

    for (let index = 0; index < productos.length; index++) {
      const element = productos[index];
      totaMonto += (element.cantidad * element.precioVenta);
    }

    try {
        // Generar el número de serie utilizando la función proporcionada
        const numeroSerie = await generarNumerSerie();

        // Obtener la fecha actual
        const fechaVentas = new Date().toISOString().split('T')[0];

        // Monto por defecto es 0, y estado es 1
        const monto = totaMonto;
        const estado = 1;

        const query = `
            INSERT INTO ventas (IdCliente, IdEmpleado, NumeroSerie, FechaVentas, Monto, Estado)
            VALUES (?, ?, ?, ?, ?, ?)
        `;

        const values = [idCliente, idEmpleado, numeroSerie, fechaVentas, monto, estado];

        db.query(query, values, (error, results) => {
            if (error) {
                console.error('Error al registrar la venta:', error);
                res.status(500).json({ error: 'Error interno del servidor' });
            } else {
                // Insertar los productos en la tabla 'detalle_ventas'
                const detalleQuery = `
                    INSERT INTO detalle_ventas (IdVentas, IdProducto, Cantidad, PrecioVenta)
                    VALUES (?, ?, ?, ?)
                `;

                const idVentas = results.insertId;

                const detalleValues = productos.map((producto) => [
                    idVentas,
                    producto.id_producto,
                    producto.cantidad,
                    producto.precioVenta
                ]);

                // guardar el detalle de la venta
                var banderaError = false;
                var errores = "";
                detalleValues.forEach((detalle, index) => {
                    db.query(detalleQuery, detalle, (error) => {
                        if (error) {
                            errores += `Error al insertar detalle del producto ${index + 1}: ${error}`;
                            banderaError = true;
                        }
                    });
                });

                // Enviar una respuesta al cliente después de que todas las inserciones se completen
                if(banderaError == true){
                    res.status(500).json({ error: 'Ocurrieron los siguientes errores '+errores });
                }else{
                    res.status(200).send('Venta registrada exitosamente');
                }
            }
        });
    } catch (error) {
        console.error('Error al generar el número de serie:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});


// cancelar venta 
app.post('/cancelar-venta', async (req, res) => {
  const { idVenta } = req.body;

  db.query('UPDATE ventas SET estado = ? WHERE IdVentas = ?', [2, idVenta], (err, result) => {
    if (err) {
      console.error('Error al actualizar el estado de la venta: ' + err.message);
      res.status(500).send('Error interno del servidor');
    } else {
      res.status(200).send('Venta cancelda exitosamente');
    }
  });

});

//generar numero de serie
function generarNumerSerie() {
    return new Promise((resolve, reject) => {
        db.query('SELECT MAX(NumeroSerie) FROM ventas', (error, results) => {
            if (error) {
                reject(error);
                return;
            }

            const ultimoNumero = results[0]['MAX(NumeroSerie)'];

            let numero;
            if (ultimoNumero) {
                // Extraer el número y aumentarlo en 1
                numero = parseInt(ultimoNumero.substring(2)) + 1;
            } else {
                // Si no hay registros, empezar desde 1
                numero = 1;
            }

            // Formatear el nuevo número con ceros a la izquierda
            const nuevoNumero =  numero.toString().padStart(5, '0');

            resolve(nuevoNumero);
        });
    });
}

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
