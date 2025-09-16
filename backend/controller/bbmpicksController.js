import { supabase } from "../config/supabaseClient.js";

// Add BBM Picks
export async function addBbmPick(req, res) {
  try {
    const { name } = req.body;
    const imageFile = req.file; 
    let imageUrl = null;
    
    // Upload image to Supabase Storage if a file is provided
    if (imageFile) {
        const fileExt = imageFile.originalname.split(".").pop();
        const fileName = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}.${fileExt}`;
        const { error: uploadError } = await supabase.storage.from("bbm_picks").upload(fileName, imageFile.buffer, { contentType: imageFile.mimetype, upsert: true });

        if (uploadError) return res.status(400).json({ success: false, error: uploadError.message });
        const { data: urlData } = supabase.storage.from("bbm_picks").getPublicUrl(fileName);
        imageUrl = urlData.publicUrl;
    }

    // Insert new BBM Pick into the 'bbmpicks' table
    const { data, error } = await supabase.from("bbmpicks").insert([{ name, image_url: imageUrl }]).select().single();
    if (error) return res.status(400).json({ success: false, error: error.message });
    res.status(201).json({ success: true, bbmPick: data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}

// Edit BBM Picks
export async function editBbmPick(req, res) {
  try {
    const { id } = req.params;
    const { name } = req.body;
    const imageFile = req.file;
    let updateData = { name };

    // Update image if a new one is provided
    if (imageFile) {
        const fileExt = imageFile.originalname.split(".").pop();
        const fileName = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}.${fileExt}`;
        const { error: uploadError } = await supabase.storage.from("bbm_picks").upload(fileName, imageFile.buffer, { contentType: imageFile.mimetype, upsert: true });
        if (uploadError) return res.status(400).json({ success: false, error: uploadError.message });
        const { data: urlData } = supabase.storage.from("bbm_picks").getPublicUrl(fileName);
        updateData.image_url = urlData.publicUrl;
    }

    // Update the record in the 'bbmpicks' table
    const { data, error } = await supabase.from("bbmpicks").update(updateData).eq("id", id).select().single();
    if (error) return res.status(400).json({ success: false, error: error.message });
    res.json({ success: true, bbmPick: data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}

// Delete BBM Picks
export async function deleteBbmPick(req, res) {
  try {
    const { id } = req.params;
    // The foreign key constraint with ON DELETE CASCADE will handle deleting the mapping entries
    const { error } = await supabase.from("bbmpicks").delete().eq("id", id);
    if (error) return res.status(400).json({ success: false, error: error.message });
    res.json({ success: true, message: "BBM Pick deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}

// View All BBM Picks
export async function getAllBbmPicks(req, res) {
  try {
    const { data, error } = await supabase.from("bbmpicks").select("*");
    if (error) return res.status(400).json({ success: false, error: error.message });
    res.json({ success: true, bbmPicks: data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}

export async function getSingleBbmPick(req, res) {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from("bbmpicks")
      .select("*")
      .eq("id", id)
      .single();

    if (error) return res.status(400).json({ success: false, error: error.message });
    if (!data) return res.status(404).json({ success: false, error: "BBM Pick not found" });

    res.json({ success: true, bbmPick: data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}