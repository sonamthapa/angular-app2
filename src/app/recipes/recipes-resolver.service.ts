  //use guard to encode to access the detail before we fetch or
    //use resolver it is a guard that runs before the route is loaded
import { Injectable } from '@angular/core';
import { Resolve, ActivatedRoute, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Recipe } from './recipe.model';
import { DataStorageService } from '../shared/data-storage.service';
import { RecipeService } from './recipe.service';


@Injectable({providedIn: 'root'})
export class RecipesResolverService implements Resolve<Recipe[]>{
    constructor(private dataStorageService: DataStorageService,
                private recipeService: RecipeService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const recipes =  this.recipeService.getRecipes();

        if (recipes.length ===0) {
            return this.dataStorageService.fetchRecipes()
        } else {
            return recipes;
        }
    }
}