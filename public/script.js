var PRICE=9.99;
var LOAD_NUM=10;
//console.log(scrollMonitor);
new Vue({
   el:'#app',
   data:{
       total:0,
       items:[],
       cart:[],
       results:[],
       newSearch:'anime',//setup default search used with life cycle hook
       lastSearch:'',
       loading:false,
       price:PRICE
       
   },
   mounted:function(){
       this.onSubmit();
       var vueInstance=this;//access to vue..
       var elem=document.getElementById("product-list-bottom");
       var watcher=scrollMonitor.create(elem);
       watcher.enterViewport(function(){
            vueInstance.appendItems(); //... this. is not available here
       });
   },
   computed:{
        noMoreItems: function(){
            return this.items.length===this.results.length && this.results.length>0
        }
   },
   methods:{
      
       appendItems:function(){
           if (this.items.length<this.results.length){
            var append=this.results.slice(this.items.length,this.items.length+LOAD_NUM);
            this.items=this.items.concat(append);

           }
       },
       onSubmit:function(){
           if (this.newSearch.length>0){
                this.items=[];
                this.loading=true;
                this.$http.get('/search/'.concat(this.newSearch))
                .then( function(res){
                    this.lastSearch=this.newSearch;
                    this.results=res.data
                    this.appendItems();
                    this.loading=false;
                });
           } 
       },
       additem: function(index){
        this.total+=PRICE;
        var item=this.items[index];
        var found=false;
        for (var i = 0; i < this.cart.length; i++) {
            if (this.cart[i].id===item.id){
                this.cart[i].qty++;
                found=true;
                break;
            }         
        }     
        if (!found){
            this.cart.push({
                id:item.id,
                title:item.title,
                qty:1,
                price:PRICE
            });
        }              
       },
       inc: function(item){
            item.qty++;
            this.total+=PRICE;
       },
       dec: function(item){
            item.qty--;
            if (item.qty<=0) {
                for (i = 0; i < this.cart.length; i++) {
                    if (this.cart[i].id===item.id){
                        this.cart.splice(i,1);
                        break;
                        //this.total-=PRICE;
                    }
                    
                }
            } 
        }     
        
   },
   filters:{
       currency:function(price){
            return "€".concat(price.toFixed(2));
       }
   }

});


