import axios from "axios";
import { promises as fs } from "fs";
import { resolve } from "path";

(async () => {
  const response = await axios.post<ArrayBuffer>(
    process.env.LAMBDA_ENDPOINT_URL!,
    {
      cardType: "occupation",
      id: "AR018",
      name: "欠陥建築設計士",
      minPlayers: 1,
      description:
        "1部屋建設するたびにそのコストを好きな資材2つ少なくできる。この効果を使って建てた部屋には家族を収容できない。（部屋タイルを斜めに配置して区別する。）",
      mainImage: "https://placehold.jp/300x300.png",
      hasBonusSymbol: false,
    },
    {
      responseType: "arraybuffer",
    }
  );

  await fs.writeFile(resolve(__dirname, "e2e-result-occupation.png"), Buffer.from(response.data));
})();
