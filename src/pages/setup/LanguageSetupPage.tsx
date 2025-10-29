import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Trash2, Plus, Edit, Languages as LanguagesIcon, FileText, Download } from "lucide-react";
import SetupPageLayout from "@/components/SetupPageLayout";
import { populateInitialTranslations } from "@/lib/populateTranslations";
import { useLanguage } from "@/context/LanguageContext";

interface Language {
  id: string;
  code: string;
  name: string;
  native_name: string;
  is_rtl: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface Translation {
  id: string;
  key_name: string;
  language_code: string;
  translated_text: string;
  group_category?: string;
  created_at: string;
  updated_at: string;
}

const LanguageSetupPage = () => {
  const { t } = useLanguage();
  const [languages, setLanguages] = useState<Language[]>([]);
  const [translations, setTranslations] = useState<Translation[]>([]);
  const [selectedLanguage, setSelectedLanguage] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [isLanguageDialogOpen, setIsLanguageDialogOpen] = useState(false);
  const [isTranslationDialogOpen, setIsTranslationDialogOpen] = useState(false);
  const [allTranslationKeys, setAllTranslationKeys] = useState<string[]>([]);
  
  const [languageForm, setLanguageForm] = useState({
    code: "",
    name: "",
    native_name: "",
    is_rtl: false,
    is_active: true,
  });
  
  const [translationForm, setTranslationForm] = useState({
    key_name: "",
    language_code: "",
    translated_text: "",
    group_category: "",
  });
  
  const [editingLanguage, setEditingLanguage] = useState<Language | null>(null);
  const [editingTranslation, setEditingTranslation] = useState<Translation | null>(null);

  useEffect(() => {
    loadLanguages();
    loadAllTranslationKeys();
  }, []);

  useEffect(() => {
    if (selectedLanguage) {
      loadTranslations(selectedLanguage);
    } else {
      setTranslations([]);
    }
  }, [selectedLanguage]);

  const loadLanguages = async () => {
    try {
      const { data, error } = await supabase
        .from("languages")
        .select("*")
        .order("name", { ascending: true });

      if (error) throw error;
      setLanguages(data || []);
    } catch (err: any) {
      console.error("Error loading languages:", err);
      toast.error("Failed to load languages");
    }
  };

  const loadTranslations = async (languageCode: string) => {
    try {
      const { data, error } = await supabase
        .from("language_setup")
        .select("*")
        .eq("language_code", languageCode)
        .order("key_name", { ascending: true });

      if (error) throw error;
      setTranslations(data || []);
    } catch (err: any) {
      console.error("Error loading translations:", err);
      toast.error("Failed to load translations");
    }
  };

  const loadAllTranslationKeys = async () => {
    try {
      const { data, error } = await supabase
        .from("language_setup")
        .select("key_name")
        .order("key_name", { ascending: true });

      if (error) throw error;
      
      // Get unique keys
      const uniqueKeys = Array.from(new Set(data?.map(t => t.key_name) || []));
      setAllTranslationKeys(uniqueKeys);
    } catch (err: any) {
      console.error("Error loading translation keys:", err);
    }
  };

  const saveLanguage = async () => {
    setLoading(true);
    try {
      if (!languageForm.code || !languageForm.name) {
        toast.error(t('lang.codeAndNameRequired'));
        setLoading(false);
        return;
      }

      if (editingLanguage) {
        const { error } = await supabase
          .from("languages")
          .update({
            code: languageForm.code,
            name: languageForm.name,
            native_name: languageForm.native_name,
            is_rtl: languageForm.is_rtl,
            is_active: languageForm.is_active,
          })
          .eq("id", editingLanguage.id);

        if (error) throw error;
        toast.success(t('lang.languageUpdated'));
        setEditingLanguage(null);
      } else {
        const { error } = await supabase.from("languages").insert([
          {
            code: languageForm.code,
            name: languageForm.name,
            native_name: languageForm.native_name,
            is_rtl: languageForm.is_rtl,
            is_active: languageForm.is_active,
          },
        ]);

        if (error) throw error;
        toast.success(t('lang.languageCreated'));
      }

      await loadLanguages();
      setLanguageForm({ code: "", name: "", native_name: "", is_rtl: false, is_active: true });
      setIsLanguageDialogOpen(false);
    } catch (err: any) {
      console.error("saveLanguage error:", err);
      toast.error(err?.message || "Failed to save language");
    } finally {
      setLoading(false);
    }
  };

  const saveTranslation = async () => {
    setLoading(true);
    try {
      if (!translationForm.key_name || !translationForm.translated_text || !translationForm.language_code) {
        toast.error(t('lang.keyValueLanguageRequired'));
        setLoading(false);
        return;
      }

      if (editingTranslation) {
        const { error } = await supabase
          .from("language_setup")
          .update({
            key_name: translationForm.key_name,
            translated_text: translationForm.translated_text,
            language_code: translationForm.language_code,
            group_category: translationForm.group_category || null,
          })
          .eq("id", editingTranslation.id);

        if (error) throw error;
        toast.success(t('lang.translationUpdated'));
        setEditingTranslation(null);
      } else {
        const { error } = await supabase.from("language_setup").insert([
          {
            key_name: translationForm.key_name,
            translated_text: translationForm.translated_text,
            language_code: translationForm.language_code || selectedLanguage,
            group_category: translationForm.group_category || null,
          },
        ]);

        if (error) throw error;
        toast.success(t('lang.translationCreated'));
      }

      if (translationForm.language_code) {
        await loadTranslations(translationForm.language_code);
      } else if (selectedLanguage) {
        await loadTranslations(selectedLanguage);
      }
      await loadAllTranslationKeys();
      setTranslationForm({ key_name: "", language_code: "", translated_text: "", group_category: "" });
      setIsTranslationDialogOpen(false);
    } catch (err: any) {
      console.error("saveTranslation error:", err);
      toast.error(err?.message || "Failed to save translation");
    } finally {
      setLoading(false);
    }
  };

  const deleteLanguage = async (id: string) => {
    setLoading(true);
    try {
      const { error } = await supabase.from("languages").delete().eq("id", id);

      if (error) throw error;
      toast.success(t('lang.languageDeleted'));
      await loadLanguages();
      if (selectedLanguage && languages.find((l) => l.id === id)?.code === selectedLanguage) {
        setSelectedLanguage("");
      }
    } catch (err: any) {
      console.error("deleteLanguage error:", err);
      toast.error(err?.message || "Failed to delete language");
    } finally {
      setLoading(false);
    }
  };

  const deleteTranslation = async (id: string) => {
    setLoading(true);
    try {
      const { error } = await supabase.from("language_setup").delete().eq("id", id);

      if (error) throw error;
      toast.success(t('lang.translationDeleted'));
      if (selectedLanguage) await loadTranslations(selectedLanguage);
    } catch (err: any) {
      console.error("deleteTranslation error:", err);
      toast.error(err?.message || "Failed to delete translation");
    } finally {
      setLoading(false);
    }
  };

  const handlePopulateTranslations = async () => {
    setLoading(true);
    try {
      const result = await populateInitialTranslations();
      await loadLanguages();
      if (selectedLanguage) await loadTranslations(selectedLanguage);
    } catch (err: any) {
      console.error("Error populating translations:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SetupPageLayout
      title={t('lang.title')}
      description={t('lang.description')}
      headerTitle="Setup"
    >
      <div className="space-y-6">
        {/* Stats Card */}
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <LanguagesIcon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{t('lang.totalLanguages')}</p>
                  <p className="text-2xl font-bold">{languages.length}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{t('lang.translations')}</p>
                  <p className="text-2xl font-bold">{translations.length}</p>
                </div>
              </div>
              <Button 
                onClick={handlePopulateTranslations}
                disabled={loading}
                variant="default"
                className="gap-2"
              >
                <Download className="h-4 w-4" />
                {loading ? t('lang.populating') : t('lang.populateAll')}
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Languages Card */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>{t('lang.languages')}</CardTitle>
                  <CardDescription>{t('lang.manageLanguages')}</CardDescription>
                </div>
                <Dialog open={isLanguageDialogOpen} onOpenChange={setIsLanguageDialogOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm" onClick={() => {
                      setEditingLanguage(null);
                      setLanguageForm({ code: "", name: "", native_name: "", is_rtl: false, is_active: true });
                    }}>
                      <Plus className="h-4 w-4 mr-2" />
                      {t('lang.addLanguage')}
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>{editingLanguage ? t('lang.editLanguage') : t('lang.addNewLanguage')}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="code">{t('lang.languageCode')} *</Label>
                          <Input
                            id="code"
                            value={languageForm.code}
                            onChange={(e) => setLanguageForm({ ...languageForm, code: e.target.value.toLowerCase() })}
                            placeholder="en"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="name">{t('lang.name')} *</Label>
                          <Input
                            id="name"
                            value={languageForm.name}
                            onChange={(e) => setLanguageForm({ ...languageForm, name: e.target.value })}
                            placeholder="English"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="native_name">{t('lang.nativeName')}</Label>
                        <Input
                          id="native_name"
                          value={languageForm.native_name}
                          onChange={(e) => setLanguageForm({ ...languageForm, native_name: e.target.value })}
                          placeholder="English"
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="is_rtl"
                          checked={languageForm.is_rtl}
                          onCheckedChange={(checked) => setLanguageForm({ ...languageForm, is_rtl: checked === true })}
                        />
                        <Label htmlFor="is_rtl" className="cursor-pointer">
                          {t('lang.rtlLanguage')}
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="is_active"
                          checked={languageForm.is_active}
                          onCheckedChange={(checked) => setLanguageForm({ ...languageForm, is_active: checked === true })}
                        />
                        <Label htmlFor="is_active" className="cursor-pointer">
                          {t('lang.active')}
                        </Label>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsLanguageDialogOpen(false)}>
                        {t('app.cancel')}
                      </Button>
                      <Button onClick={saveLanguage} disabled={loading}>
                        {loading ? t('lang.saving') : editingLanguage ? t('lang.update') : t('lang.create')}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t('lang.code')}</TableHead>
                      <TableHead>{t('lang.name')}</TableHead>
                      <TableHead>{t('lang.status')}</TableHead>
                      <TableHead className="text-right">{t('lang.actions')}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {languages.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                          {t('lang.noLanguages')}
                        </TableCell>
                      </TableRow>
                    ) : (
                      languages.map((language) => (
                        <TableRow key={language.id}>
                          <TableCell className="font-mono font-medium">{language.code}</TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium">{language.name}</p>
                              <p className="text-sm text-muted-foreground">{language.native_name}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              {language.is_active ? (
                                <Badge variant="default">{t('lang.active')}</Badge>
                              ) : (
                                <Badge variant="secondary">{t('lang.inactive')}</Badge>
                              )}
                              {language.is_rtl && (
                                <Badge variant="outline">{t('lang.rtl')}</Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => {
                                  setEditingLanguage(language);
                                  setLanguageForm({
                                    code: language.code,
                                    name: language.name,
                                    native_name: language.native_name,
                                    is_rtl: language.is_rtl,
                                    is_active: language.is_active,
                                  });
                                  setIsLanguageDialogOpen(true);
                                }}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive">
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>{t('lang.deleteLanguage')}</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      {t('lang.deleteLanguageConfirm').replace('{name}', language.name)}
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>{t('app.cancel')}</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => deleteLanguage(language.id)} className="bg-destructive hover:bg-destructive/90">
                                      {t('app.delete')}
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Translations Card */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>{t('lang.translations')}</CardTitle>
                  <CardDescription>{t('lang.manageTranslations')}</CardDescription>
                </div>
                <Dialog open={isTranslationDialogOpen} onOpenChange={setIsTranslationDialogOpen}>
                  <DialogTrigger asChild>
                    <Button 
                      size="sm" 
                      disabled={languages.length === 0}
                      onClick={() => {
                        setEditingTranslation(null);
                        setTranslationForm({ 
                          key_name: "", 
                          language_code: selectedLanguage || "", 
                          translated_text: "",
                          group_category: ""
                        });
                      }}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      {t('lang.addTranslation')}
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>{editingTranslation ? t('lang.editTranslation') : t('lang.addNewTranslation')}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="trans-lang">{t('app.language')} *</Label>
                        <Select
                          value={translationForm.language_code}
                          onValueChange={(value) => setTranslationForm({ ...translationForm, language_code: value })}
                        >
                          <SelectTrigger id="trans-lang">
                            <SelectValue placeholder={t('lang.selectLanguage')} />
                          </SelectTrigger>
                          <SelectContent>
                            {languages.map((lang) => (
                              <SelectItem key={lang.code} value={lang.code}>
                                {lang.name} ({lang.code})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="trans-key">{t('lang.translationKey')} *</Label>
                        <Select
                          value={translationForm.key_name}
                          onValueChange={(value) => setTranslationForm({ ...translationForm, key_name: value })}
                        >
                          <SelectTrigger id="trans-key">
                            <SelectValue placeholder={t('lang.selectKey') || "Select a translation key"} />
                          </SelectTrigger>
                          <SelectContent position="popper" className="max-h-[200px]">
                            {allTranslationKeys.map((key) => (
                              <SelectItem key={key} value={key}>
                                {key}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="trans-value">{t('lang.translatedText')} *</Label>
                        <Input
                          id="trans-value"
                          value={translationForm.translated_text}
                          onChange={(e) => setTranslationForm({ ...translationForm, translated_text: e.target.value })}
                          placeholder="Welcome"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="trans-category">{t('lang.category')} ({t('lang.optional')})</Label>
                        <Input
                          id="trans-category"
                          value={translationForm.group_category}
                          onChange={(e) => setTranslationForm({ ...translationForm, group_category: e.target.value })}
                          placeholder="auth, dashboard, etc."
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsTranslationDialogOpen(false)}>
                        {t('app.cancel')}
                      </Button>
                      <Button onClick={saveTranslation} disabled={loading}>
                        {loading ? t('lang.saving') : editingTranslation ? t('lang.update') : t('lang.create')}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Select
                  value={selectedLanguage}
                  onValueChange={setSelectedLanguage}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t('lang.selectLanguageFirst')} />
                  </SelectTrigger>
                  <SelectContent>
                    {languages.map((lang) => (
                      <SelectItem key={lang.code} value={lang.code}>
                        {lang.name} ({lang.code})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>{t('lang.key')}</TableHead>
                        <TableHead>{t('lang.value')}</TableHead>
                        <TableHead className="text-right">{t('lang.actions')}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {!selectedLanguage ? (
                        <TableRow>
                          <TableCell colSpan={3} className="text-center text-muted-foreground py-8">
                            {t('lang.selectLanguageFirst')}
                          </TableCell>
                        </TableRow>
                      ) : translations.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={3} className="text-center text-muted-foreground py-8">
                            {t('lang.noTranslations')}
                          </TableCell>
                        </TableRow>
                      ) : (
                        translations.map((translation) => (
                          <TableRow key={translation.id}>
                            <TableCell className="font-mono text-sm">{translation.key_name}</TableCell>
                            <TableCell>{translation.translated_text}</TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-2">
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => {
                                    setEditingTranslation(translation);
                                    setTranslationForm({
                                      key_name: translation.key_name,
                                      language_code: translation.language_code,
                                      translated_text: translation.translated_text,
                                      group_category: translation.group_category || "",
                                    });
                                    setIsTranslationDialogOpen(true);
                                  }}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive">
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>{t('lang.deleteTranslation')}</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        {t('lang.deleteTranslationConfirm')}
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>{t('app.cancel')}</AlertDialogCancel>
                                      <AlertDialogAction onClick={() => deleteTranslation(translation.id)} className="bg-destructive hover:bg-destructive/90">
                                        {t('app.delete')}
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </SetupPageLayout>
  );
};

export default LanguageSetupPage;
