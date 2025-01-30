import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectItem } from "@/components/ui/select";
import axios from "axios";

export default function VerifyInfluencers() {
  const [influencer, setInfluencer] = useState("");
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("all");

  const fetchClaims = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`/api/fetch-tweets?influencer=${influencer}`);
      const extractedClaims = await axios.post("/api/extract-claims", { text: data.tweets.join(" ") });
      setClaims(extractedClaims.data);
    } catch (error) {
      console.error("Error fetching claims", error);
    }
    setLoading(false);
  };

  const filteredClaims = filter === "all" ? claims : claims.filter(claim => claim.category === filter);

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-xl font-bold mb-4">Verify Influencer Claims</h1>
      <div className="flex gap-2 mb-4">
        <Input value={influencer} onChange={(e) => setInfluencer(e.target.value)} placeholder="Enter influencer name" />
        <Button onClick={fetchClaims} disabled={loading}>{loading ? "Loading..." : "Fetch Claims"}</Button>
      </div>
      <div className="mb-4">
        <Select value={filter} onChange={setFilter}>
          <SelectItem value="all">All</SelectItem>
          <SelectItem value="nutrition">Nutrition</SelectItem>
          <SelectItem value="mental-health">Mental Health</SelectItem>
          <SelectItem value="medicine">Medicine</SelectItem>
        </Select>
      </div>
      {filteredClaims.length > 0 && (
        <div className="grid gap-4">
          {filteredClaims.map((claim, index) => (
            <Card key={index}>
              <CardContent className="p-4">
                <p>{claim.text}</p>
                <p className="text-sm text-gray-500">Category: {claim.category}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
