import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { RecipeService } from '../recipes/recipe.service';
import { Recipe } from '../recipes/recipe.model';
import { User } from '../auth/user.model';
import { map, tap,take, exhaustMap } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';
import { throwError } from 'rxjs';



@Injectable()
export class DataStorageService {
    
    constructor(private http: HttpClient,
                private recipeService: RecipeService,
                private authService: AuthService){}
    
    storeRecipes(){
        const recipes = this.recipeService.getRecipes();
        //subscribe directly in service cuz i have no intrest in response in component otherwise subscribe in component
        this.http.put('https://angular-app-8d857.firebaseio.com/recipes.json',recipes)
        .subscribe(response=>{
            //console.log(response)
        })

    }
    fetchRecipes() {
        //we pipe user and http into one big observable
        //take -get currently activa user and unsubscribe automatically
        //exhaustMap- waits for first observable ie user observable to complete and 
        //gives us user now we return a new observable in inner body which replace previous observable in our entire chain observable
        //return this.authService.user.pipe(take(1), exhaustMap( user =>{
            return this.http.get<Recipe[]>('https://angular-app-8d857.firebaseio.com/recipes.json')
            .pipe(
            map(recipes=> {
            return recipes.map(recipe => {
                return {
                        ...recipe, 
                        ingredients: recipe.ingredients ? recipe.ingredients: []}
            })
        }), 
        tap(recipes =>{
            this.recipeService.setRecipes(recipes)
        //.subscribe(recipes=> {
            //this.recipeService.setRecipes(recipes)
            //typescript doesn't understand recipes are in array of recipes, cuz we have body of http response that could be anything so type needed
        })
        );
    }   
}  
    //use guard to encode to access the detail before we fetch or
    //use resolver it is a guard that runs before the route is loaded