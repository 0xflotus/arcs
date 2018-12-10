// Copyright (c) 2017 Google Inc. All rights reserved.
// This code may only be used under the BSD style license found at
// http://polymer.github.io/LICENSE.txt
// Code distributed by Google as part of this project is also
// subject to an additional IP rights grant found at
// http://polymer.github.io/PATENTS.txt

import {Strategy, Descendant} from '../../planning/strategizer.js';
import {Recipe} from '../recipe/recipe.js';
import {assert} from '../../platform/assert-web.js';

export class InitSearch extends Strategy {
  _search;
  
  constructor(arc, {search}) {
    super(arc, {search});
    this._search = search;
  }

  async generate({generation}): Promise<Descendant[]> {
    if (this._search == null || generation !== 0) {
      return [];
    }

    const recipe = new Recipe();
    recipe.setSearchPhrase(this._search);
    assert(recipe.normalize());
    assert(!recipe.isResolved());

    return [{
      result: recipe,
      score: 0,
      derivation: [{strategy: this, parent: undefined}],
      hash: recipe.digest(),
      valid: true
    }];
  }
}