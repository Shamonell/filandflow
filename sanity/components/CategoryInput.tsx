/**
 * Champ « Rubrique » de la fiche produit.
 *
 * Remplace le sélecteur de référence standard de Sanity par des boutons à
 * cocher (toutes les rubriques visibles d'un coup d'œil) et ajoute, en dernier,
 * un bouton « + Nouvelle rubrique » : Elisabeth crée la rubrique sans quitter
 * sa fiche, et elle est cochée aussitôt.
 */

import { useCallback, useEffect, useId, useState, type FormEvent } from "react";
import { set, useClient, type ObjectInputProps, type Reference } from "sanity";
import { Box, Button, Card, Flex, Grid, Radio, Stack, Text, TextArea, TextInput } from "@sanity/ui";
import { AddIcon } from "@sanity/icons";

interface CategoryOption {
  _id: string;
  title: string;
  sortOrder?: number | null;
}

const CATEGORIES_QUERY = `*[_type == "shopCategory" && !(_id in path("drafts.**"))]
  | order(coalesce(sortOrder, 999) asc, title asc) { _id, title, sortOrder }`;

export default function CategoryInput(props: ObjectInputProps<Reference>) {
  const { value, onChange, readOnly } = props;
  const client = useClient({ apiVersion: "2024-01-01" });
  const radioName = useId();

  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  const [adding, setAdding] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newWord, setNewWord] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let cancelled = false;
    client
      .fetch<CategoryOption[]>(CATEGORIES_QUERY)
      .then((rows) => {
        if (!cancelled) setCategories(rows ?? []);
      })
      .catch(() => {
        if (!cancelled) setLoadError(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [client]);

  const choose = useCallback(
    (id: string) => {
      onChange(set({ _type: "reference", _ref: id }));
    },
    [onChange]
  );

  const resetForm = () => {
    setAdding(false);
    setNewTitle("");
    setNewWord("");
    setFormError(null);
  };

  const createCategory = async (event: FormEvent) => {
    event.preventDefault();
    const title = newTitle.trim();
    if (!title) {
      setFormError("Donnez un nom à la rubrique.");
      return;
    }
    const existing = categories.find((c) => c.title.trim().toLowerCase() === title.toLowerCase());
    if (existing) {
      setFormError("Cette rubrique existe déjà : elle vient d'être cochée.");
      choose(existing._id);
      return;
    }

    setSaving(true);
    setFormError(null);
    try {
      const lastPosition = categories.reduce(
        (max, c) => (typeof c.sortOrder === "number" && c.sortOrder > max ? c.sortOrder : max),
        0
      );
      // Créée directement en version publiée : utilisable tout de suite.
      const created = await client.create({
        _type: "shopCategory",
        title,
        word: newWord.trim() || undefined,
        sortOrder: lastPosition + 1,
      });
      setCategories((prev) => [...prev, { _id: created._id, title, sortOrder: lastPosition + 1 }]);
      choose(created._id);
      resetForm();
    } catch (err) {
      console.error("Création de la rubrique impossible :", err);
      setFormError("La rubrique n'a pas pu être créée. Vérifiez votre connexion et réessayez.");
    } finally {
      setSaving(false);
    }
  };

  const selected = value?._ref;

  return (
    <Stack space={3}>
      {loading && (
        <Text size={1} muted>
          Chargement des rubriques…
        </Text>
      )}
      {loadError && (
        <Card padding={3} radius={2} tone="critical">
          <Text size={1}>Les rubriques n&apos;ont pas pu être chargées. Rechargez la page.</Text>
        </Card>
      )}
      {!loading && !loadError && categories.length === 0 && (
        <Text size={1} muted>
          Aucune rubrique pour l&apos;instant : créez la première avec le bouton ci-dessous.
        </Text>
      )}

      {categories.length > 0 && (
        <Grid columns={[1, 2, 3]} gap={2}>
          {categories.map((category) => {
            const checked = selected === category._id;
            return (
              <Card
                key={category._id}
                as="label"
                padding={3}
                radius={2}
                border
                tone={checked ? "primary" : "default"}
                style={{ cursor: readOnly ? "default" : "pointer" }}
              >
                <Flex align="center" gap={2}>
                  <Radio
                    name={radioName}
                    checked={checked}
                    disabled={readOnly}
                    onChange={() => choose(category._id)}
                  />
                  <Text size={1} weight={checked ? "semibold" : "regular"}>
                    {category.title}
                  </Text>
                </Flex>
              </Card>
            );
          })}
        </Grid>
      )}

      {!readOnly && !adding && (
        <Box>
          <Button
            icon={AddIcon}
            mode="ghost"
            tone="primary"
            text="Nouvelle rubrique"
            onClick={() => setAdding(true)}
          />
        </Box>
      )}

      {!readOnly && adding && (
        <Card padding={3} radius={2} border tone="primary">
          <form onSubmit={createCategory}>
            <Stack space={3}>
              <Stack space={2}>
                <Text size={1} weight="semibold">
                  Nom de la rubrique
                </Text>
                <TextInput
                  autoFocus
                  value={newTitle}
                  maxLength={40}
                  placeholder="Ex. Pour les petits"
                  onChange={(e) => setNewTitle(e.currentTarget.value)}
                />
              </Stack>
              <Stack space={2}>
                <Text size={1} weight="semibold">
                  Petit mot (facultatif)
                </Text>
                <TextArea
                  rows={2}
                  value={newWord}
                  maxLength={220}
                  placeholder="Une phrase pour présenter la rubrique"
                  onChange={(e) => setNewWord(e.currentTarget.value)}
                />
              </Stack>
              {formError && (
                <Card padding={2} radius={2} tone="critical">
                  <Text size={1}>{formError}</Text>
                </Card>
              )}
              <Flex gap={2} wrap="wrap">
                <Button
                  type="submit"
                  tone="primary"
                  text={saving ? "Création…" : "Créer et cocher"}
                  disabled={saving}
                />
                <Button mode="ghost" text="Annuler" onClick={resetForm} disabled={saving} />
              </Flex>
            </Stack>
          </form>
        </Card>
      )}
    </Stack>
  );
}
