const marcadores = [];

var miMapa;
/*
marcadores =  [{"AGENTE":"001","NOMBRE":"LUIS","POSICIONES":{"longitud":"6","latitud":"5"}},
              {"AGENTE":"002","NOMBRE":"LUIS","POSICIONES":{"longitud":"6","latitud":"5"}}];

console.log(marcadores);
//console.log(marcadores.LUIS[0].POSICIONES.longitud);

///var marcadores = [];

for (let i in marcadores) 
{    
    console.log(marcadores[i].AGENTE);
    console.log(marcadores[i].POSICIONES.longitud);
    marcadores[i].POSICIONES.longitud = 50;
    console.log(marcadores[i].POSICIONES.longitud);
    
  for (let j in marcadores[i]) 
  {    
      console.log(marcadores[i][j]);
  }
}
*/

    async function procesaDatos( _data)
    {
        let data = _data;
        let  codigo = _data.CODIGO;

        //console.log("PROCESANDO",data);


        var elemento = marcadores.find( elemen => elemen.AGENTE == data.CODIGO);
        console.log("RESU ",elemento);
        

        if( elemento != undefined)
        {
            elemento.MARCADOR.setMap(null);
            console.log("EXISTE Elemento : ", elemento);
            elemento.MARCADOR = new google.maps.Marker({
                position: new google.maps.LatLng(data.POSICION.LATITUD , data.POSICION.LONGITUD),
                map: miMapa,
                title:data.NOMBRE
            });         

            elemento.MARCADOR.addListener('click', function() 
            {
                elemento.SEGUIR = "1";
                miMapa.setZoom(8);
                console.log("CLICK: ",marcadores);
                miMapa.setCenter(elemento.MARCADOR.getPosition());
            });

        }
        else
        {
            console.log("CREO Elemento : ");
            let agente = data.CODIGO.toString();
            const image = "https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png";
            console.log(1,data.CODIGO);
            var MarcadorAgente = new google.maps.Marker(
                {
                    position: new google.maps.LatLng(data.POSICION.LATITUD , data.POSICION.LONGITUD),
                    map: miMapa,
                    title:data.NOMBRE
                });                
                marcadores[marcadores.length] = {"AGENTE":agente,"MARCADOR":MarcadorAgente,"SEGUIR":'0'};

                MarcadorAgente.addListener('click', (e) =>
                {                    
                    console.log(MarcadorAgente);                   
                    console.log(e);                   
                    miMapa.setCenter(MarcadorAgente.getPosition());                    
                });
        }
        console.log("FINAL: ",marcadores);
        const moveto = marcadores.find( elemen => elemen.SEGUIR == '1')
        console.log("MOVE: ",moveto);
        moveToLocation(  moveto);
    }


    function moveToLocation(data)
    {
        console.log("movido");
        //const center;
        if( data != undefined )
            miMapa.setCenter(data.MARCADOR.getPosition());                    
            //miMapa.panTo(new google.maps.LatLng(data.POSICION.LATITUD , data.POSICION.LONGITUD));
      }

    async function procesa ( xdata )
    {
        /*
        const promises = await Promise.all(xdata.map(e => somethingAsync(e)));
        for (const res of promises) 
        {
            procesaDatos( res );
        }*/
        
        
        for  (let j in marcadores) 
        {    
            marcadores[j].MARCADOR.setMap(null);
        }
        //marcadores.length = 0;

        for  (let i in xdata) 
        {    
            //console.log(i,xdata[i].CODIGO);            
            
            await    procesaDatos( xdata[i] );
            
            
            //console.log(i,xdata[i].CODIGO);            
        }
        console.log(marcadores);
    }

 function inicializar() 
 {
   var starCountRef = firebase.database().ref('POSICIONES');
   starCountRef.on('value', (snapshot) => 
   {
        var data = snapshot.val();//.child("longitud").val();
        console.log(data);
        //console.log(data.AGENTE.CODIGO);
        //console.log(data.NOMBRE);
        //console.log(data.AGENTE.POSICIONES.LATITUD);
        //console.log(data.AGENTE.POSICIONES.LONGITUD);
        procesa ( data );
        
        
   });
     //Opciones del mapa
     var OpcionesMapa = {
         center: new google.maps.LatLng(38.3489719, -0.4780289000000266),
         mapTypeId: google.maps.MapTypeId.HYBRID, //ROADMAP  SATELLITE HYBRID TERRAIN
         mapMaker: true,
         zoom: 5
     };
  
     
     //constructor
     miMapa = new google.maps.Map(document.getElementById('mapa'), OpcionesMapa);
 
     //Añadimos el marcador
     
 }
  
 function CargaScript() {
     var script = document.createElement('script');
     script.src = 'https://maps.googleapis.com/maps/api/js?sensor=false&callback=inicializar';
     document.body.appendChild(script);                 
 }
  
 window.onload = CargaScript;