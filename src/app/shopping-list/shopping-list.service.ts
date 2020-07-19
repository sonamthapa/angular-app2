import { Ingredient } from '../shared/ingredient.model';
import { Subject, Subscription } from 'rxjs';



export class ShoppinglistService {

    ingredientsChanged = new Subject<Ingredient[]>();
    private subscription: Subscription;
    startedEditing = new Subject<number>();


    private ingredients : Ingredient[] = [
        new Ingredient('Tomato',10),
        new Ingredient('Apples',5),
      ];

      getIngredients() {
          return this.ingredients.slice();
      }

      getIngredient(index: number) {
          return this.ingredients[index];
      }

      addIngredient(ingredient: Ingredient) {
          this.ingredients.push(ingredient);
          this.ingredientsChanged.next(this.ingredients.slice())
      }
      
      addIngredients(ingredients: Ingredient[]) {
        this.ingredients.push(...ingredients);
        this.ingredientsChanged.next(this.ingredients.slice())
    }

    updateIngredient(index: number, newIngredient: Ingredient){
        this.ingredients[index] = newIngredient;
        this.ingredientsChanged.next(this.ingredients.slice())
    }

    deleteIngredient (index: number) {
        this.ingredients.splice(index, 1);
        this.ingredientsChanged.next(this.ingredients.slice());
    }
}