import jsdom from "jsdom";
import fetch from "node-fetch";
import type { NextApiRequest, NextApiResponse } from "next";

const ingredients = async (req: NextApiRequest, res: NextApiResponse) => {
  const { url } = req.query;

  try {
    if (typeof url === "string") {
      const response = await fetch(url);
      const html = await response.text();

      const dom = new jsdom.JSDOM(html);
      const { document } = dom.window;
      const title = document
        .querySelector("h1")
        ?.textContent?.replace("レシピ・作り方", "")
        .trim();

      const ingredientList = Array.from(
        document.querySelector(".ingredient-list")?.children || []
      ).filter((ingredient) => !ingredient.classList.contains("group-title"));

      const jsonIngredientList = ingredientList.map((e) => {
        const ingredient = e.children;
        return {
          name: ingredient[0].textContent?.trim(),
          amount: ingredient[1].textContent?.trim(),
        };
      });

      const result = {
        title,
        ingredientList: jsonIngredientList,
      };

      res.json(result);
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

export default ingredients;
