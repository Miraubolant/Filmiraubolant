export function getZodiacSign(birthDate: string): { name: string; symbol: string; dates: string } {
  const date = new Date(birthDate);
  const day = date.getDate();
  const month = date.getMonth() + 1;

  const signs = {
    Bélier: { symbol: '♈', dates: '21 mars - 19 avril' },
    Taureau: { symbol: '♉', dates: '20 avril - 20 mai' },
    Gémeaux: { symbol: '♊', dates: '21 mai - 20 juin' },
    Cancer: { symbol: '♋', dates: '21 juin - 22 juillet' },
    Lion: { symbol: '♌', dates: '23 juillet - 22 août' },
    Vierge: { symbol: '♍', dates: '23 août - 22 septembre' },
    Balance: { symbol: '♎', dates: '23 septembre - 22 octobre' },
    Scorpion: { symbol: '♏', dates: '23 octobre - 21 novembre' },
    Sagittaire: { symbol: '♐', dates: '22 novembre - 21 décembre' },
    Capricorne: { symbol: '♑', dates: '22 décembre - 19 janvier' },
    Verseau: { symbol: '♒', dates: '20 janvier - 18 février' },
    Poissons: { symbol: '♓', dates: '19 février - 20 mars' }
  };

  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) {
    return { name: 'Bélier', ...signs.Bélier };
  }
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) {
    return { name: 'Taureau', ...signs.Taureau };
  }
  if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) {
    return { name: 'Gémeaux', ...signs.Gémeaux };
  }
  if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) {
    return { name: 'Cancer', ...signs.Cancer };
  }
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) {
    return { name: 'Lion', ...signs.Lion };
  }
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) {
    return { name: 'Vierge', ...signs.Vierge };
  }
  if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) {
    return { name: 'Balance', ...signs.Balance };
  }
  if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) {
    return { name: 'Scorpion', ...signs.Scorpion };
  }
  if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) {
    return { name: 'Sagittaire', ...signs.Sagittaire };
  }
  if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) {
    return { name: 'Capricorne', ...signs.Capricorne };
  }
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) {
    return { name: 'Verseau', ...signs.Verseau };
  }
  return { name: 'Poissons', ...signs.Poissons };
}