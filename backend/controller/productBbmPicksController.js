import { supabase } from "../config/supabaseClient.js";

// 1️⃣ Map a single product to a BBM Pick using IDs
export const mapProductToBbmPick = async (req, res) => {
  try {
    const { product_id, bbmpicks_id } = req.body;

    if (!product_id || !bbmpicks_id) {
      return res.status(400).json({ error: 'product_id and bbmpicks_id are required.' });
    }

    // Insert mapping (ignore if duplicate)
    const { error } = await supabase
      .from('product_bbmpicks')
      .insert([{ product_id, bbmpicks_id }]);

    if (error) {
      if (error.code === '23505') {
        return res.status(409).json({ error: 'Mapping already exists.' });
      }
      return res.status(500).json({ error: error.message });
    }

    res.status(201).json({ message: 'Product mapped to BBM Pick successfully.' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// 2️⃣ Remove a product from a BBM Pick
export const removeProductFromBbmPick = async (req, res) => {
  try {
    const { product_id, bbmpicks_id } = req.body;

    const { error } = await supabase
      .from('product_bbmpicks')
      .delete()
      .eq('product_id', product_id)
      .eq('bbmpicks_id', bbmpicks_id);

    if (error) return res.status(500).json({ error: error.message });

    res.status(200).json({ message: 'Mapping removed successfully.' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// 3️⃣ Get all BBM Picks stocking a product
export const getBbmPicksForProduct = async (req, res) => {
  try {
    const { product_id } = req.params;

    const { data, error } = await supabase
      .from('product_bbmpicks')
      .select('bbmpicks_id, bbmpicks (id, name, image_url)')
      .eq('product_id', product_id);

    if (error) return res.status(500).json({ error: error.message });

    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// 4️⃣ Get all products in a BBM Pick
export const getProductsForBbmPick = async (req, res) => {
  try {
    const { bbmpicks_id } = req.params;

    const { data, error } = await supabase
      .from('product_bbmpicks')
      .select('product_id, products (id, name, price, rating, image, category)')
      .eq('bbmpicks_id', bbmpicks_id);

    if (error) return res.status(500).json({ error: error.message });

    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// 5️⃣ Bulk map products by names and BBM Pick name
export const bulkMapByNames = async (req, res) => {
  try {
    const { bbmpicks_name, product_names } = req.body;

    if (!bbmpicks_name || !product_names || !Array.isArray(product_names)) {
      return res.status(400).json({ error: 'bbmpicks_name and product_names[] are required.' });
    }

    // 1. Get BBM Pick ID from name
    const { data: bbmPickData, error: bbmPickError } = await supabase
      .from('bbmpicks')
      .select('id')
      .eq('name', bbmpicks_name)
      .single();

    if (bbmPickError || !bbmPickData) {
      return res.status(404).json({ error: 'BBM Pick not found.' });
    }

    // 2. Get product IDs from names
    const { data: products, error: productError } = await supabase
      .from('products')
      .select('id, name')
      .in('name', product_names);

    if (productError || !products.length) {
      return res.status(404).json({ error: 'No matching products found.' });
    }

    // 3. Map each product to BBM Pick
    const inserts = products.map(p => ({
      product_id: p.id,
      bbmpicks_id: bbmPickData.id
    }));

    const { error: insertError } = await supabase
      .from('product_bbmpicks')
      .insert(inserts, { upsert: false });

    if (insertError && insertError.code !== '23505') {
      return res.status(500).json({ error: insertError.message });
    }

    res.status(201).json({
      message: `Mapped ${products.length} products to BBM Pick "${bbmpicks_name}".`,
      mapped_products: products.map(p => p.name)
    });

  } catch (err) {
    console.error('Bulk map error:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
};