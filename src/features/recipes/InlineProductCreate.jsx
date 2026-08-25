import { useState } from "react";
import { useCreateProducts } from "../products/products.queries";
import { Input } from "@/components/ui/input.jsx";
import { Button } from "@/components/ui/button.jsx";

export function InlineProductCreate({ onCreated, onCancel }) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");

  const createMutation = useCreateProducts();

  return (
    <div>
      <Input
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <Input
        placeholder="Price"
        value={price}
        type="number"
        onChange={(e) => setPrice(e.target.value)}
      />
      <Input
        placeholder="Quantity"
        type="number"
        value={quantity}
        onChange={(e) => setQuantity(e.target.value)}
      />

      <Button
        type="button"
        onClick={() => {
          createMutation.mutate(
            { name, price: Number(price), quantity: Number(quantity) },
            {
              onSuccess: (response) => {
                onCreated(response.data);
              },
            },
          );
        }}
      >
        Add
      </Button>
      <Button type="button" variant="ghost" onClick={onCancel}>
        Cancel
      </Button>
    </div>
  );
}
